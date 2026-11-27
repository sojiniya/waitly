import { BottomNav } from "@/components/customer/bottom-nav";
import { StoreList } from "@/features/stores/store-list";
import { getStore, getStores, MY_ACTIVE_WAITING } from "@/lib/mock-data";

// TODO(api): GET /api/stores, GET /api/waitings/me?status=ACTIVE
export default function HomePage() {
  const stores = getStores();
  const store = getStore(MY_ACTIVE_WAITING.storeId);

  return (
    <>
      <StoreList
        stores={stores}
        activeWaiting={store ? { waiting: MY_ACTIVE_WAITING, storeName: store.name } : undefined}
      />
      <BottomNav />
    </>
  );
}
