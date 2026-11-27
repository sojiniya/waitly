"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/icons";
import { Badge, reservationBadge, seatsBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StepperButton } from "@/components/ui/controls";
import { cn } from "@/lib/cn";
import { dayOfWeek, monthDayDow, parseDate } from "@/lib/format";
import { getSlotBookings } from "@/lib/mock-data";
import type { ReservationSlot } from "@/lib/types";
import { OwnerCard, OwnerPageTitle } from "./page-title";

const MAX_CAPACITY = 20;

function nextStartTime(slots: ReservationSlot[]) {
  if (slots.length === 0) return "17:00";
  const [h, m] = slots[slots.length - 1].startTime.split(":").map(Number);
  const total = h * 60 + m + 30;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export function SlotManager({ storeId, days }: { storeId: number; days: { date: string; slots: ReservationSlot[] }[] }) {
  const [dayIdx, setDayIdx] = useState(0);
  const [slotsByDate, setSlotsByDate] = useState(() => Object.fromEntries(days.map((d) => [d.date, d.slots])));
  const [selectedId, setSelectedId] = useState<number | null>(days[0]?.slots[4]?.id ?? days[0]?.slots[0]?.id ?? null);

  const date = days[dayIdx].date;
  const slots = slotsByDate[date];
  const selected = slots.find((s) => s.id === selectedId) ?? null;

  // TODO(api): PATCH /api/owner/slots/{id} { capacity } — 예약 수보다 작게 줄일 수 없음(서버도 검증)
  const setCapacity = (id: number, capacity: number) =>
    setSlotsByDate((all) => ({
      ...all,
      [date]: all[date].map((s) => (s.id === id ? { ...s, capacity: Math.max(s.reservedCount, Math.min(MAX_CAPACITY, capacity)) } : s)),
    }));

  // TODO(api): POST /api/owner/stores/{id}/slots
  const addSlot = () => {
    const slot: ReservationSlot = {
      id: Date.now(),
      storeId,
      slotDate: date,
      startTime: nextStartTime(slots),
      capacity: 4,
      reservedCount: 0,
    };
    setSlotsByDate((all) => ({ ...all, [date]: [...all[date], slot] }));
    setSelectedId(slot.id);
  };

  const bookings = selected ? getSlotBookings(selected) : [];

  return (
    <>
      <OwnerPageTitle
        title="예약 슬롯 관리"
        description="날짜별 시간대와 정원을 정하면 고객 화면의 잔여석이 바로 바뀌어요"
        actions={
          <Button size="md" className="shadow-none" onClick={addSlot}>
            <PlusIcon size={16} strokeWidth={2.4} />
            시간대 추가
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="날짜">
        {days.map((d, i) => {
          const on = i === dayIdx;
          return (
            <button
              key={d.date}
              type="button"
              aria-pressed={on}
              aria-label={monthDayDow(d.date)}
              onClick={() => {
                setDayIdx(i);
                setSelectedId(slotsByDate[d.date][0]?.id ?? null);
              }}
              className={cn(
                "flex h-16 w-[76px] flex-col items-center justify-center gap-0.5 rounded-btn border",
                on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink",
              )}
            >
              <span className="text-xs font-semibold">{dayOfWeek(d.date)}</span>
              <span className="text-lg font-extrabold">{parseDate(d.date).getDate()}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <OwnerCard className="min-w-0 flex-[3_1_480px] overflow-hidden">
          {slots.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-title font-bold">이 날은 예약 시간대가 없어요</p>
              <p className="mt-1 text-sm text-ink-muted">정기 휴무일이에요. 예약을 받으려면 시간대를 추가하세요.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead className="bg-surface text-xs text-ink-muted">
                  <tr>
                    <th scope="col" className="w-24 py-3 pl-5 font-semibold">시작 시각</th>
                    <th scope="col" className="py-3 font-semibold">예약 현황</th>
                    <th scope="col" className="w-[146px] py-3 pl-4 font-semibold">정원</th>
                    <th scope="col" className="w-24 py-3 pr-5 text-right font-semibold">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((s) => {
                    const left = s.capacity - s.reservedCount;
                    const badge = seatsBadge(left);
                    const pct = s.capacity === 0 ? 0 : Math.round((s.reservedCount / s.capacity) * 100);
                    const on = s.id === selectedId;
                    return (
                      <tr key={s.id} className={cn("border-t border-fill", on ? "bg-brand-tint" : "bg-white")}>
                        <td className="py-2.5 pl-5">
                          <button
                            type="button"
                            aria-pressed={on}
                            aria-label={`${s.startTime} 예약자 보기`}
                            onClick={() => setSelectedId(s.id)}
                            className="h-10 text-title font-extrabold"
                          >
                            {s.startTime}
                          </button>
                        </td>
                        <td className="py-2.5">
                          <span className="flex items-center gap-2.5">
                            <span className="h-2 flex-1 overflow-hidden rounded-full bg-fill">
                              <span
                                className={cn("block h-full rounded-full", left <= 0 ? "bg-ink-faint" : left === 1 ? "bg-brand" : "bg-ink")}
                                style={{ width: `${pct}%` }}
                              />
                            </span>
                            <span className="w-14 text-right text-[13px] font-semibold tabular-nums">
                              {s.reservedCount} / {s.capacity}
                            </span>
                          </span>
                        </td>
                        <td className="py-2.5 pl-4">
                          <span className="flex items-center gap-1.5">
                            <StepperButton
                              dir="dec"
                              label={`${s.startTime} 정원`}
                              value={s.capacity}
                              min={Math.max(1, s.reservedCount)}
                              max={MAX_CAPACITY}
                              onChange={(v) => setCapacity(s.id, v)}
                              size={32}
                            />
                            <span className="w-7 text-center font-bold tabular-nums">{s.capacity}</span>
                            <StepperButton
                              dir="inc"
                              label={`${s.startTime} 정원`}
                              value={s.capacity}
                              min={Math.max(1, s.reservedCount)}
                              max={MAX_CAPACITY}
                              onChange={(v) => setCapacity(s.id, v)}
                              size={32}
                            />
                          </span>
                        </td>
                        <td className="py-2.5 pr-5 text-right">
                          <Badge tone={badge.tone}>{badge.label}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </OwnerCard>

        <OwnerCard className="min-w-0 flex-[2_1_300px] px-5 py-4.5">
          {selected ? (
            <>
              <h2 className="text-title font-bold">
                {monthDayDow(date)} {selected.startTime}
              </h2>
              <p className="mt-0.5 text-[13px] text-ink-muted">
                예약 {bookings.length}건 · 잔여 {Math.max(0, selected.capacity - selected.reservedCount)}석
              </p>
              <ul className="mt-3.5 flex flex-col gap-2">
                {bookings.map((b, i) => {
                  const badge = b.status === "VISITED" ? { tone: "neutral" as const, label: "방문" } : reservationBadge(b.status);
                  return (
                    <li key={i} className="flex items-center gap-2.5 rounded-btn border border-line px-3.5 py-3">
                      <span className="flex-1">
                        <span className="block text-sm font-bold">
                          {b.maskedName} · {b.partySize}명
                        </span>
                        <span className="block text-xs text-ink-muted">{b.maskedPhone}</span>
                      </span>
                      <Badge tone={badge.tone} className="px-[9px] py-[3px]">
                        {badge.label}
                      </Badge>
                    </li>
                  );
                })}
                {bookings.length === 0 && (
                  <li className="rounded-btn border border-dashed border-line-strong p-6 text-center text-sm text-ink-muted">
                    아직 이 시간대 예약이 없어요
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p className="py-6 text-center text-sm text-ink-muted">시간대를 고르면 예약자가 보여요</p>
          )}
        </OwnerCard>
      </div>
    </>
  );
}
