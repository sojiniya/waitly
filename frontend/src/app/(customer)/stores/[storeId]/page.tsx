import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StoreDetail } from "@/features/stores/store-detail";
import { getSlots, getStore, MOCK_TODAY } from "@/lib/mock-data";

export default function StorePage({ params }: PageProps<"/stores/[storeId]">) {
  return (
    <Suspense fallback={<StoreDetailSkeleton />}>
      <StoreDetailLoader params={params} />
    </Suspense>
  );
}

// TODO(api): GET /api/stores/{id}, GET /api/stores/{id}/slots?date=오늘
async function StoreDetailLoader({ params }: { params: PageProps<"/stores/[storeId]">["params"] }) {
  const { storeId } = await params;
  const store = getStore(Number(storeId));
  if (!store) notFound();

  const slotsLeftToday = getSlots(store.id, MOCK_TODAY).filter((s) => s.capacity > s.reservedCount).length;
  return <StoreDetail store={store} slotsLeftToday={slotsLeftToday} />;
}

function StoreDetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="매장 정보를 불러오는 중" className="flex flex-1 flex-col">
      <div className="h-[220px] bg-fill" />
      <div className="-mt-5 flex flex-1 flex-col gap-4 rounded-t-sheet bg-white px-5 pt-5.5">
        <div className="skeleton h-6 w-24 rounded-md" />
        <div className="skeleton h-8 w-44 rounded-md" />
        <div className="grid grid-cols-2 gap-2">
          <div className="skeleton h-21 rounded-card" />
          <div className="skeleton h-21 rounded-card" />
        </div>
      </div>
    </div>
  );
}
