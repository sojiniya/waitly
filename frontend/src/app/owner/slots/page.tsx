import type { Metadata } from "next";
import { SlotManager } from "@/features/owner/slot-manager";
import { getSlots, OWNER_STORE_ID, upcomingDates } from "@/lib/mock-data";

export const metadata: Metadata = { title: "예약 슬롯 관리" };

// TODO(api): GET /api/owner/stores/{id}/slots?from=오늘&days=7
export default function OwnerSlotsPage() {
  const days = upcomingDates(7).map((date) => ({ date, slots: getSlots(OWNER_STORE_ID, date) }));
  return <SlotManager storeId={OWNER_STORE_ID} days={days} />;
}
