"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Segmented, SwitchTrack } from "@/components/ui/controls";
import { cn } from "@/lib/cn";
import { monthDayDow, nowHHMM } from "@/lib/format";
import type { QueueEntry, Store, StoreStatus } from "@/lib/types";
import { OwnerCard, OwnerPageTitle } from "./page-title";

const STATUS_OPTIONS: { value: StoreStatus; label: string; activeClass: string }[] = [
  { value: "OPEN", label: "영업 중", activeClass: "text-success" },
  { value: "PAUSED", label: "일시 중지", activeClass: "text-warning" },
  { value: "CLOSED", label: "영업 종료", activeClass: "text-ink-strong" },
];

const BLOCKED_MESSAGE = {
  CLOSED: "영업 종료 상태예요. 고객 화면에 “영업 종료”로 보이고 새 웨이팅을 받지 않아요.",
  PAUSED: "일시 중지 상태예요. 기존 대기열은 유지되고 새 웨이팅만 막혀요.",
  OFF: "웨이팅 접수가 꺼져 있어요. 고객은 등록 버튼 대신 “지금은 웨이팅을 받지 않아요”를 보게 돼요.",
};

/** 목: 새 손님이 들어오는 간격 */
const ARRIVAL_MS = 7000;
const MAX_DEMO_QUEUE = 8;

export function QueueDashboard({
  store,
  today,
  initialQueue,
  initialStats,
}: {
  store: Store;
  today: string;
  initialQueue: QueueEntry[];
  initialStats: { seated: number; noShow: number };
}) {
  const [status, setStatus] = useState<StoreStatus>(store.status);
  const [accepting, setAccepting] = useState(store.waitingEnabled);
  const [queue, setQueue] = useState(initialQueue);
  const [stats, setStats] = useState(initialStats);
  /** 화면을 연 시점의 마지막 발급 번호. 이보다 큰 번호는 새로 들어온 줄로 강조합니다. */
  const [lastIssued] = useState(() => Math.max(0, ...initialQueue.map((x) => x.waitingNumber)));

  const open = status === "OPEN" && accepting;

  // 목: 접수 중일 때 새 웨이팅이 들어옵니다. (실제로는 SSE 이벤트)
  useEffect(() => {
    if (!open) return;
    const iv = setInterval(() => {
      const at = nowHHMM();
      setQueue((q) => {
        if (q.length >= MAX_DEMO_QUEUE) return q;
        const no = Math.max(lastIssued, ...q.map((x) => x.waitingNumber)) + 1;
        return [...q, { waitingNumber: no, partySize: 1 + (no % 4), createdAt: at, status: "WAITING" }];
      });
    }, ARRIVAL_MS);
    return () => clearInterval(iv);
  }, [open, lastIssued]);

  const call = (no: number) =>
    setQueue((q) => q.map((x) => (x.waitingNumber === no ? { ...x, status: "CALLED", calledAt: nowHHMM() } : x)));
  const finish = (no: number, result: "seated" | "noShow") => {
    setQueue((q) => q.filter((x) => x.waitingNumber !== no));
    setStats((s) => ({ ...s, [result]: s[result] + 1 }));
  };

  const waitingCount = queue.filter((x) => x.status === "WAITING").length;
  const calledCount = queue.length - waitingCount;
  const blocked = status !== "OPEN" ? BLOCKED_MESSAGE[status] : !accepting ? BLOCKED_MESSAGE.OFF : null;

  // 순번 = 이 줄 앞까지의 WAITING 수 + 1 (호출된 팀은 순번 없음)
  const rows = queue.map((x, i) => {
    if (x.status !== "WAITING") return { ...x, order: null, imminent: false };
    const order = queue.slice(0, i + 1).filter((y) => y.status === "WAITING").length;
    return { ...x, order, imminent: order <= 2 };
  });

  return (
    <>
      <OwnerPageTitle
        title={store.name}
        description={`${monthDayDow(today)} · 대기 목록은 자동으로 갱신돼요`}
        badge={
          <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
            <span className="size-[7px] animate-[wl-blink_1.4s_infinite] rounded-full bg-live" />
            실시간 연결됨
          </span>
        }
        actions={
          <>
            <Segmented
              label="영업 상태"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
              itemClassName="h-9 px-3.5 text-[13px]"
            />
            <button
              type="button"
              role="switch"
              aria-checked={accepting}
              onClick={() => setAccepting((v) => !v)}
              className="flex h-11 items-center gap-2.5 rounded-btn border border-line bg-white pr-3.5 pl-2.5 text-sm font-semibold"
            >
              <SwitchTrack checked={accepting} />
              웨이팅 접수
            </button>
          </>
        }
      />

      {blocked && (
        <p role="status" className="rounded-btn border border-warning-line bg-warning-soft px-4 py-3 text-sm font-semibold text-warning-ink">
          {blocked}
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <Kpi label="대기 중" value={waitingCount} />
        <Kpi label="호출 중" value={calledCount} className="text-brand" />
        <Kpi label="오늘 착석" value={stats.seated} />
        <Kpi label="오늘 노쇼" value={stats.noShow} className="text-danger" />
      </div>

      <OwnerCard className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4">
          <h2 className="text-title font-bold">실시간 대기 목록</h2>
          <p className="text-[13px] text-ink-muted">호출 후 {store.callGraceMinutes}분이 지나면 노쇼로 처리할 수 있어요</p>
        </div>
        {rows.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-title font-bold">대기 중인 팀이 없어요</p>
            <p className="mt-1 text-sm text-ink-muted">새 웨이팅이 들어오면 여기에 바로 나타나요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-surface text-xs font-semibold text-ink-muted">
                <tr>
                  <th scope="col" className="w-[82px] py-2.5 pl-5 font-semibold">순번</th>
                  <th scope="col" className="w-[92px] py-2.5 font-semibold">발급 번호</th>
                  <th scope="col" className="w-[82px] py-2.5 font-semibold">인원</th>
                  <th scope="col" className="w-[102px] py-2.5 font-semibold">등록</th>
                  <th scope="col" className="w-[142px] py-2.5 font-semibold">상태</th>
                  <th scope="col" className="py-2.5 pr-5 text-right font-semibold">처리</th>
                </tr>
              </thead>
              <tbody aria-live="polite">
                {rows.map((r) => (
                  <tr key={r.waitingNumber} className={cn("border-t border-fill", r.waitingNumber > lastIssued && "animate-fresh")}>
                    <td className="py-3 pl-5 text-title font-extrabold">{r.order ?? "—"}</td>
                    <td className="py-3 font-bold">{r.waitingNumber}번</td>
                    <td className="py-3">{r.partySize}명</td>
                    <td className="py-3 text-ink-sub">{r.createdAt}</td>
                    <td className="py-3">
                      {r.status === "CALLED" ? (
                        <Badge tone="called">호출됨 {r.calledAt}</Badge>
                      ) : r.imminent ? (
                        <Badge tone="imminent">입장 임박</Badge>
                      ) : (
                        <Badge tone="info">대기 중</Badge>
                      )}
                    </td>
                    <td className="py-2 pr-5">
                      <div className="flex justify-end gap-1.5">
                        {r.status === "WAITING" ? (
                          <Button size="sm" className="shadow-none" onClick={() => call(r.waitingNumber)}>
                            호출
                          </Button>
                        ) : (
                          <>
                            <Button size="sm" variant="dark" onClick={() => finish(r.waitingNumber, "seated")}>
                              착석
                            </Button>
                            <Button size="sm" variant="danger-outline" className="px-3" onClick={() => finish(r.waitingNumber, "noShow")}>
                              노쇼
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </OwnerCard>
    </>
  );
}

function Kpi({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <OwnerCard className="px-4.5 py-4">
      <p className="text-[13px] text-ink-muted">{label}</p>
      <p className={cn("mt-1 text-[30px] font-extrabold", className)}>
        {value}
        <span className="text-body font-semibold text-ink-muted"> 팀</span>
      </p>
    </OwnerCard>
  );
}
