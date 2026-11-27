import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/customer/chrome";
import { ReserveFlow } from "@/features/reservations/reserve-flow";
import { getSlots, getStore, upcomingDates } from "@/lib/mock-data";

export default function ReservePage({ params }: PageProps<"/stores/[storeId]/reserve">) {
  return (
    <Suspense fallback={<ReserveSkeleton />}>
      <ReserveLoader params={params} />
    </Suspense>
  );
}

// TODO(api): GET /api/stores/{id}/slots?from=오늘&days=7
async function ReserveLoader({ params }: { params: PageProps<"/stores/[storeId]/reserve">["params"] }) {
  const { storeId } = await params;
  const store = getStore(Number(storeId));
  if (!store) notFound();

  const days = upcomingDates(7).map((date) => ({ date, slots: getSlots(store.id, date) }));
  return <ReserveFlow store={store} days={days} />;
}

function ReserveSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-1 flex-col">
      <PageHeader backHref="/" title="예약" align="left" />
      <div className="flex flex-col gap-3 px-5 pt-5">
        <div className="skeleton h-16 rounded-btn" />
        <div className="skeleton h-32 rounded-btn" />
      </div>
    </div>
  );
}
