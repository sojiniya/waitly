import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QueueDashboard } from "@/features/owner/queue-dashboard";
import { MOCK_TODAY, OWNER_QUEUE, OWNER_STORE_ID, OWNER_TODAY_STATS, getStore } from "@/lib/mock-data";

export const metadata: Metadata = { title: "대기열 관리" };

// TODO(api): GET /api/owner/stores/{id}/waitings + SSE /api/stores/{id}/waitings/stream
export default function OwnerQueuePage() {
  const store = getStore(OWNER_STORE_ID);
  if (!store) notFound();
  return <QueueDashboard store={store} today={MOCK_TODAY} initialQueue={OWNER_QUEUE} initialStats={OWNER_TODAY_STATS} />;
}
