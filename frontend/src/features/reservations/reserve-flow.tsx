"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomBar, PageHeader } from "@/components/customer/chrome";
import { AlertIcon, CalendarEmptyIcon, CheckIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button, buttonClass, Spinner } from "@/components/ui/button";
import { StepperButton } from "@/components/ui/controls";
import { cn } from "@/lib/cn";
import { dayOfWeek, monthDay, monthDayDow, parseDate } from "@/lib/format";
import { isClosedDay } from "@/lib/mock-data";
import { reserveSlot } from "@/lib/mock-api";
import type { ReservationSlot, Store } from "@/lib/types";

interface Day {
  date: string;
  slots: ReservationSlot[];
}

export function ReserveFlow({ store, days }: { store: Store; days: Day[] }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [slotId, setSlotId] = useState<number | null>(null);
  const [party, setParty] = useState(2);
  const [phase, setPhase] = useState<"pick" | "loading" | "done">("pick");
  /** 동시 확정으로 마감된 슬롯 */
  const [soldOut, setSoldOut] = useState<Set<number>>(new Set());
  const [raceSlot, setRaceSlot] = useState<number | null>(null);
  const [raced, setRaced] = useState(false);

  const day = days[dayIdx];
  const seatsLeft = (s: ReservationSlot) => (soldOut.has(s.id) ? 0 : s.capacity - s.reservedCount);
  const selected = day.slots.find((s) => s.id === slotId) ?? null;
  const loading = phase === "loading";
  const anyOpen = day.slots.some((s) => seatsLeft(s) > 0);
  const storeAcceptsWaiting = store.status === "OPEN" && store.waitingEnabled;

  const pickDay = (i: number) => {
    setDayIdx(i);
    setSlotId(null);
    setRaceSlot(null);
  };

  const changeParty = (n: number) => {
    setParty(n);
    if (selected && seatsLeft(selected) < n) setSlotId(null);
  };

  const confirm = async () => {
    if (!selected || loading) return;
    setPhase("loading");
    const res = await reserveSlot({ seatsLeft: seatsLeft(selected), partySize: party, alreadyRaced: raced });
    if (res.ok) {
      setPhase("done");
      return;
    }
    // 다른 사람이 먼저 확정: 슬롯을 마감으로 바꾸고 선택을 풀어요
    setSoldOut((prev) => new Set(prev).add(selected.id));
    setRaceSlot(selected.id);
    setRaced(true);
    setSlotId(null);
    setPhase("pick");
  };

  const when = selected ? `${monthDay(day.date)} ${selected.startTime}` : "";

  if (phase === "done" && selected) {
    return (
      <>
        <PageHeader backHref={`/stores/${store.id}`} title={`${store.name} 예약`} align="left" />
        <main className="flex flex-1 flex-col items-center px-6 pt-12 pb-7 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckIcon size={30} strokeWidth={2.6} />
          </span>
          <Badge tone="success" className="mt-4.5">
            예약 확정
          </Badge>
          <h2 className="mt-2.5 text-2xl font-extrabold">예약이 확정됐어요</h2>
          <dl className="mt-6 flex w-full flex-col gap-3 rounded-card border border-line p-4.5 text-left text-body">
            <Row label="매장" value={store.name} />
            <Row label="일시" value={`${monthDayDow(day.date)} ${selected.startTime}`} />
            <Row label="인원" value={`${party}명`} />
          </dl>
          <div className="flex-1" />
          <Link href="/history/reservations" className={buttonClass("primary", "lg", "mt-8 w-full shadow-none")}>
            내 예약 내역 보기
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <PageHeader backHref={`/stores/${store.id}`} title={`${store.name} 예약`} align="left" />

      <main className="flex flex-1 flex-col gap-5.5 px-5 pt-4.5 pb-6">
        <section aria-labelledby="date-label">
          <h2 id="date-label" className="mb-2.5 text-body font-bold">
            날짜
          </h2>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              const on = i === dayIdx;
              const closed = isClosedDay(d.date);
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => pickDay(i)}
                  aria-pressed={on}
                  aria-label={`${monthDayDow(d.date)}${closed ? " 휴무" : ""}`}
                  className={cn(
                    "flex h-16 flex-col items-center justify-center gap-0.5 rounded-btn border",
                    on ? "border-ink bg-ink text-white" : cn("border-line bg-white", closed ? "text-ink-faint" : "text-ink"),
                  )}
                >
                  <span className="text-[11px] font-semibold">{i === 0 ? "오늘" : dayOfWeek(d.date)}</span>
                  <span className="text-[17px] font-extrabold">{parseDate(d.date).getDate()}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="time-label">
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 id="time-label" className="text-body font-bold">
              시간
            </h2>
            <span className="text-xs text-ink-muted">숫자는 남은 자리</span>
          </div>
          {day.slots.length > 0 && anyOpen ? (
            <div className="grid grid-cols-4 gap-2">
              {day.slots.map((s) => {
                const left = seatsLeft(s);
                const full = left <= 0;
                const tooSmall = !full && left < party;
                const on = s.id === slotId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={full || tooSmall || loading}
                    aria-pressed={on}
                    aria-label={`${s.startTime} ${full ? "마감" : `${left}석 남음${tooSmall ? ", 인원 초과" : ""}`}`}
                    onClick={() => {
                      setSlotId(s.id);
                      setRaceSlot(null);
                    }}
                    className={cn(
                      "flex h-14.5 flex-col items-center justify-center gap-0.5 rounded-btn border",
                      full
                        ? "border-fill bg-fill text-ink-faint"
                        : on
                          ? "border-brand bg-brand text-white"
                          : "border-line bg-white text-ink disabled:opacity-45",
                      raceSlot === s.id && "animate-shake",
                    )}
                  >
                    <span className={cn("text-body font-bold", full && "line-through")}>{s.startTime}</span>
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        full ? "text-ink-faint" : on ? "text-white" : left <= 1 ? "text-brand-ink" : "text-ink-muted",
                      )}
                    >
                      {full ? "마감" : `${left}석`}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong px-4 py-7 text-center">
              <CalendarEmptyIcon size={36} strokeWidth={1.8} className="text-ink-faint" />
              <p className="mt-3 text-body font-bold">예약 가능한 시간이 없어요</p>
              <p className="mt-1 text-[13px] text-ink-muted">
                {day.slots.length === 0 ? "정기 휴무일이에요. 다른 날짜를 골라 주세요." : "모든 시간이 마감됐어요."}
              </p>
              {storeAcceptsWaiting && dayIdx === 0 && (
                <Link href={`/stores/${store.id}`} className={buttonClass("secondary", "md", "mt-4")}>
                  웨이팅으로 줄 서기
                </Link>
              )}
            </div>
          )}
        </section>

        <section aria-labelledby="party-label">
          <h2 id="party-label" className="mb-2.5 text-body font-bold">
            인원
          </h2>
          <div className="flex items-center justify-between rounded-card border border-line py-2 pr-2 pl-4">
            <span className="text-title font-bold" aria-live="polite">
              {party}명
            </span>
            <div className="flex gap-1.5">
              <StepperButton dir="dec" label="인원" value={party} min={1} max={store.maxPartySize} onChange={changeParty} disabled={loading} />
              <StepperButton dir="inc" label="인원" value={party} min={1} max={store.maxPartySize} onChange={changeParty} disabled={loading} />
            </div>
          </div>
        </section>

        {raceSlot !== null && (
          <div role="alert" className="flex gap-2 rounded-btn border border-danger-line bg-danger-soft px-3.5 py-3 text-danger">
            <AlertIcon size={18} className="mt-px shrink-0" />
            <div>
              <p className="text-sm font-bold">방금 마감되었습니다</p>
              <p className="mt-0.5 text-[13px]">다른 분이 먼저 확정했어요. 다른 시간을 선택해 주세요.</p>
            </div>
          </div>
        )}
      </main>

      <BottomBar className="pt-3.5">
        <div className="mb-3 flex justify-between text-sm">
          <span className="text-ink-muted">선택</span>
          <span className="font-bold">{selected ? `${when} · ${party}명` : "시간을 골라 주세요"}</span>
        </div>
        <Button
          className="w-full shadow-none data-[busy=true]:disabled:bg-brand data-[busy=true]:disabled:text-white"
          disabled={!selected || loading}
          data-busy={loading}
          aria-busy={loading}
          onClick={confirm}
        >
          {loading ? (
            <>
              <Spinner />
              확정하는 중…
            </>
          ) : (
            "예약 확정"
          )}
        </Button>
      </BottomBar>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
