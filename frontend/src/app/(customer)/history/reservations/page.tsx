import type { Metadata } from "next";
import { reservationBadge } from "@/components/ui/badge";
import { HistoryGroup, HistoryItem } from "@/features/history/history-item";
import { monthDayDow, parseDate } from "@/lib/format";
import { getStore, MOCK_TODAY, MY_RESERVATIONS } from "@/lib/mock-data";
import type { Reservation } from "@/lib/types";

export const metadata: Metadata = { title: "예약 내역" };

const RESULT: Record<Reservation["status"], string> = {
  CONFIRMED: "",
  VISITED: "방문",
  CANCELED: "취소",
  NO_SHOW: "미방문",
};

function dDay(date: string) {
  const days = Math.round((parseDate(date).getTime() - parseDate(MOCK_TODAY).getTime()) / 86_400_000);
  return days === 0 ? "오늘" : `D-${days}`;
}

// TODO(api): GET /api/reservations/me
export default function ReservationHistoryPage() {
  const upcoming = MY_RESERVATIONS.filter((r) => r.status === "CONFIRMED" && r.slotDate >= MOCK_TODAY);
  const past = MY_RESERVATIONS.filter((r) => !upcoming.includes(r));

  const item = (r: Reservation, live = false) => (
    <HistoryItem
      key={r.id}
      store={getStore(r.storeId)?.name ?? ""}
      badge={reservationBadge(r.status)}
      meta={`${monthDayDow(r.slotDate)} ${r.startTime} · ${r.partySize}명`}
      right={live ? dDay(r.slotDate) : RESULT[r.status]}
      href={live ? `/stores/${r.storeId}` : undefined}
      live={live}
    />
  );

  return (
    <>
      <HistoryGroup title="다가오는 예약">
        {upcoming.length > 0 ? (
          upcoming.map((r) => item(r, true))
        ) : (
          <p className="rounded-card border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-muted">
            다가오는 예약이 없어요
          </p>
        )}
      </HistoryGroup>
      <HistoryGroup title="지난 예약">{past.map((r) => item(r))}</HistoryGroup>
    </>
  );
}
