import type { Metadata } from "next";
import { waitingBadge } from "@/components/ui/badge";
import { HistoryGroup, HistoryItem } from "@/features/history/history-item";
import { monthDay } from "@/lib/format";
import { getStore, MY_ACTIVE_WAITING, MY_PAST_WAITINGS } from "@/lib/mock-data";
import type { WaitingStatus } from "@/lib/types";

export const metadata: Metadata = { title: "웨이팅 내역" };

const RESULT: Partial<Record<WaitingStatus, string>> = {
  SEATED: "착석",
  CANCELED: "직접 취소",
  NO_SHOW: "호출 후 미입장",
};

// TODO(api): GET /api/waitings/me
export default function WaitingHistoryPage() {
  const active = MY_ACTIVE_WAITING;
  return (
    <>
      <HistoryGroup title="진행 중">
        <HistoryItem
          store={getStore(active.storeId)?.name ?? ""}
          badge={waitingBadge(active.status)}
          meta={`${active.waitingNumber}번 · ${active.partySize}명 · 오늘 ${active.createdAt} 등록`}
          right={`내 앞에 ${active.position}팀`}
          href="/waiting"
          live
        />
      </HistoryGroup>
      <HistoryGroup title="지난 웨이팅">
        {MY_PAST_WAITINGS.map((w) => (
          <HistoryItem
            key={w.id}
            store={getStore(w.storeId)?.name ?? ""}
            badge={waitingBadge(w.status)}
            meta={`${w.waitingNumber}번 · ${w.partySize}명 · ${monthDay(w.date)}`}
            right={RESULT[w.status] ?? ""}
          />
        ))}
      </HistoryGroup>
    </>
  );
}
