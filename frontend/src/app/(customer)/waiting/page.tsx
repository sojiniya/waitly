import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MyWaiting } from "@/features/waiting/my-waiting";
import { getStore, MY_ACTIVE_WAITING } from "@/lib/mock-data";

export const metadata: Metadata = { title: "내 웨이팅" };

// TODO(api): GET /api/waitings/me?status=ACTIVE → 없으면 빈 상태 화면
export default function WaitingPage() {
  const store = getStore(MY_ACTIVE_WAITING.storeId);
  if (!store) notFound();
  return <MyWaiting waiting={MY_ACTIVE_WAITING} store={store} />;
}
