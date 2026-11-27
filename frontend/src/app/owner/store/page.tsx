import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreForm } from "@/features/owner/store-form";
import { getStore, OWNER_STORE_ID } from "@/lib/mock-data";

export const metadata: Metadata = { title: "매장 정보" };

// TODO(api): GET /api/owner/stores/{id}
export default function OwnerStorePage() {
  const store = getStore(OWNER_STORE_ID);
  if (!store) notFound();
  return <StoreForm initial={store} />;
}
