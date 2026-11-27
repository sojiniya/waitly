import { BottomNav } from "@/components/customer/bottom-nav";
import { HistoryTabs } from "@/features/history/history-tabs";
import { MY_PAST_WAITINGS, MY_RESERVATIONS } from "@/lib/mock-data";

export default function HistoryLayout({ children }: LayoutProps<"/history">) {
  return (
    <>
      <header className="border-b border-line bg-white px-5 pt-4">
        <h1 className="text-[22px] font-extrabold tracking-[-0.02em]">내역</h1>
        <HistoryTabs waitingCount={MY_PAST_WAITINGS.length + 1} reservationCount={MY_RESERVATIONS.length} />
      </header>
      <main className="flex flex-1 flex-col gap-2.5 bg-surface p-4">{children}</main>
      <BottomNav />
    </>
  );
}
