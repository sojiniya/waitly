"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomSheet } from "@/components/customer/bottom-sheet";
import { BottomBar, PageHeader } from "@/components/customer/chrome";
import { BellIcon, RefreshIcon, WifiOffIcon } from "@/components/icons";
import { StoreThumb } from "@/components/store-thumb";
import { Badge, waitingBadge } from "@/components/ui/badge";
import { Button, buttonClass, Spinner } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { cancelWaiting } from "@/lib/mock-api";
import type { Store, Waiting } from "@/lib/types";
import { useWaitingStream, type ConnectionState } from "./use-waiting-stream";

export function MyWaiting({ waiting, store }: { waiting: Waiting; store: Store }) {
  const stream = useWaitingStream(waiting);
  const [sheet, setSheet] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const { status, position, conn } = stream;
  const isWaiting = status === "WAITING";
  const isCalled = status === "CALLED";
  const imminent = isWaiting && position !== null && position <= 2;
  const badge = status === "CANCELED" ? { tone: "muted" as const, label: "취소됨" } : waitingBadge(status, { imminent });

  const confirmCancel = async () => {
    setCanceling(true);
    await cancelWaiting();
    setCanceling(false);
    setSheet(false);
    stream.markCanceled();
  };

  return (
    <>
      <PageHeader
        backHref={`/stores/${store.id}`}
        title="내 웨이팅"
        right={<ConnectionPill conn={conn} onClick={stream.simulateDisconnect} />}
      />

      {conn === "reconnecting" && (
        <div role="status" className="flex items-center gap-2 border-b border-warning-line bg-warning-soft px-5 py-2.5 text-[13px] text-warning-ink">
          <WifiOffIcon size={16} />
          <span>
            연결이 끊겼어요. 다시 연결하는 중이에요
            {stream.lastUpdatedAt && <span className="font-semibold"> · 마지막 갱신 {stream.lastUpdatedAt}</span>}
          </span>
        </div>
      )}

      <main className="flex flex-1 flex-col gap-3 bg-surface px-5 pt-4 pb-6">
        <div className="flex items-center gap-3">
          <StoreThumb store={store} className="size-11 text-base" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-title font-bold">{store.name}</p>
            <p className="truncate text-[13px] text-ink-muted">
              {store.category} · {store.address.split(",")[0]}
            </p>
          </div>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {isWaiting && (
            <PositionCard position={position} imminent={imminent} stale={conn === "reconnecting"} advancedCount={stream.advancedCount} />
          )}
          {isCalled && (
            <section className="flex animate-pop flex-col items-center rounded-card bg-brand px-5 pt-7 pb-6 text-center text-white shadow-called">
              <span className="flex size-16 animate-ring items-center justify-center rounded-full bg-white text-brand">
                <BellIcon size={30} strokeWidth={2.2} />
              </span>
              <h2 className="mt-4 text-h1 font-extrabold tracking-[-0.02em]">지금 입장해 주세요</h2>
              <p className="mt-1.5 text-body opacity-95">{waiting.waitingNumber}번 고객님, 매장 입구에서 직원에게 번호를 보여 주세요</p>
              <p className="mt-4 rounded-full bg-white/20 px-3.5 py-2 text-[13px] font-semibold">
                호출 시각 {stream.calledAt} · {store.callGraceMinutes}분 안에 입장하지 않으면 노쇼 처리돼요
              </p>
            </section>
          )}
          {status === "CANCELED" && (
            <section className="rounded-card border border-line bg-white px-5 py-8 text-center">
              <h2 className="text-h2 font-extrabold">웨이팅을 취소했어요</h2>
              <p className="mt-1.5 text-sm text-ink-muted">다음에 다시 방문해 주세요</p>
              <Link href="/" className={buttonClass("secondary", "md", "mt-4.5")}>
                다른 매장 둘러보기
              </Link>
            </section>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <MiniStat label="발급 번호" value={waiting.waitingNumber} unit="번" />
          <MiniStat label="인원" value={waiting.partySize} unit="명" />
          <MiniStat label="등록 시각" value={waiting.createdAt} />
        </div>

        <Progress status={status} />

        <p className="flex items-center gap-2 px-1 text-xs text-ink-muted">
          <RefreshIcon size={14} />
          새로고침하지 않아도 순번이 자동으로 바뀌어요
        </p>
      </main>

      {(isWaiting || isCalled) && (
        <BottomBar>
          <Button variant="secondary" className="w-full text-base" onClick={() => setSheet(true)}>
            웨이팅 취소
          </Button>
        </BottomBar>
      )}

      <BottomSheet open={sheet} onClose={() => !canceling && setSheet(false)} label="웨이팅 취소 확인">
        <h2 className="text-[19px] font-extrabold">웨이팅을 취소할까요?</h2>
        <p className="mt-1.5 text-sm leading-normal text-ink-sub">
          취소하면 {waiting.waitingNumber}번 순서가 사라지고, 다시 등록하면 맨 뒤에서 시작해요.
        </p>
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" className="flex-1 text-base" disabled={canceling} onClick={() => setSheet(false)}>
            계속 기다릴게요
          </Button>
          <Button variant="dark" className="flex-1 text-base disabled:bg-ink disabled:text-white" disabled={canceling} onClick={confirmCancel}>
            {canceling ? <Spinner /> : "취소하기"}
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

function ConnectionPill({ conn, onClick }: { conn: ConnectionState; onClick: () => void }) {
  const view = {
    live: { dot: "bg-live", label: "실시간" },
    connecting: { dot: "bg-ink-faint animate-blink", label: "연결 중" },
    reconnecting: { dot: "bg-warning-dot animate-blink", label: "재연결 중" },
  }[conn];
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`실시간 연결 상태: ${view.label}`}
      title="데모: 누르면 연결 끊김 상태를 보여 줘요"
      className="flex h-7.5 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 text-xs font-semibold text-ink-strong"
    >
      <span className={cn("size-[7px] rounded-full", view.dot)} />
      {view.label}
    </button>
  );
}

function PositionCard({
  position,
  imminent,
  stale,
  advancedCount,
}: {
  position: number | null;
  imminent: boolean;
  stale: boolean;
  advancedCount: number;
}) {
  return (
    <section className="relative flex flex-col items-center rounded-card border border-line bg-white px-5 pt-6 pb-5 shadow-raised">
      <p className="text-sm font-medium text-ink-sub">내 앞에</p>
      {position === null ? (
        <>
          <span className="skeleton mt-2 h-[88px] w-24 rounded-btn" aria-label="순번을 불러오는 중" />
          <span className="skeleton mt-4.5 h-7 w-44 rounded-full" />
        </>
      ) : (
        <>
          <p className="mt-0.5 flex items-baseline gap-1">
            <span
              key={position}
              className={cn(
                "animate-pop text-display font-extrabold tracking-[-0.04em] tabular-nums transition-colors",
                stale ? "text-ink-faint" : imminent ? "text-brand" : "text-ink",
              )}
            >
              {position}
            </span>
            <span className={cn("text-2xl font-bold", stale && "text-ink-faint")}>팀</span>
          </p>
          <div className="mt-4.5 flex items-center gap-1.5" aria-hidden="true">
            {Array.from({ length: Math.min(position, 6) }, (_, i) => (
              <span key={i} className="size-7 rounded-full border border-line bg-fill" />
            ))}
            <span className="flex h-7 items-center rounded-full bg-brand px-2.5 text-xs font-bold text-white">나</span>
          </div>
        </>
      )}
      {advancedCount > 0 && !stale && (
        <span
          key={advancedCount}
          className="absolute top-3.5 right-3.5 animate-toast rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success"
        >
          방금 1팀이 입장했어요
        </span>
      )}
    </section>
  );
}

function MiniStat({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="rounded-card border border-line bg-white px-3 py-3.5">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 text-[22px] font-extrabold">
        {value}
        {unit && <span className="text-sm font-semibold">{unit}</span>}
      </p>
    </div>
  );
}

function Progress({ status }: { status: Waiting["status"] }) {
  const canceled = status === "CANCELED";
  const stage = status === "SEATED" ? 2 : status === "CALLED" ? 1 : 0;
  const steps = ["대기 중", "호출됨", "착석"];
  return (
    <ol className="flex items-center rounded-card border border-line bg-white px-4.5 py-4" aria-label="진행 단계">
      {steps.map((label, i) => {
        const reached = !canceled && i <= stage;
        return (
          <li key={label} className={cn("flex items-center", i < steps.length - 1 && "flex-1")} aria-current={i === stage && !canceled ? "step" : undefined}>
            <span className="flex w-16 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs font-bold text-white",
                  canceled ? "bg-line-strong" : reached ? "bg-brand" : "bg-line",
                )}
              >
                {i + 1}
              </span>
              <span className={cn("text-xs font-semibold", reached ? "text-ink" : "text-ink-muted")}>{label}</span>
            </span>
            {i < steps.length - 1 && (
              <span className={cn("mb-5 h-0.5 flex-1", !canceled && i < stage ? "bg-brand" : "bg-line")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
