import { cn } from "@/lib/cn";
import { CATEGORY_TINT } from "@/lib/mock-data";
import type { Store } from "@/lib/types";

/** 매장 사진 대신 쓰는 이니셜 썸네일 */
export function StoreThumb({ store, className }: { store: Pick<Store, "name" | "category" | "mark">; className?: string }) {
  const tint = CATEGORY_TINT[store.category];
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: tint.bg, color: tint.fg }}
      className={cn("flex shrink-0 items-center justify-center rounded-btn font-extrabold", className)}
    >
      {store.mark || store.name.trim().charAt(0)}
    </span>
  );
}
