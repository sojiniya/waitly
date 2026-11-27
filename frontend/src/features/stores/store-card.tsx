import Link from "next/link";
import { Badge, storeBadge } from "@/components/ui/badge";
import { StoreThumb } from "@/components/store-thumb";
import { cn } from "@/lib/cn";
import type { Store } from "@/lib/types";

/** 목록 오른쪽에 보이는 대기 요약 */
export function queueSummary(store: Pick<Store, "status" | "waitingEnabled" | "waitingTeams">) {
  if (store.status === "PAUSED") return { label: "웨이팅", value: "잠시 중지", className: "text-ink-muted" };
  if (store.status === "CLOSED" || !store.waitingEnabled) return { label: "웨이팅", value: "마감", className: "text-ink-muted" };
  if (store.waitingTeams === 0) return { label: "현재 대기", value: "바로 입장", className: "text-success" };
  return { label: "현재 대기", value: `${store.waitingTeams}팀`, className: "text-ink" };
}

export function StoreCardBody({ store, thumbClassName }: { store: Store; thumbClassName?: string }) {
  const badge = storeBadge(store.status);
  const q = queueSummary(store);
  return (
    <>
      <StoreThumb store={store} className={cn("size-14 text-[22px]", thumbClassName)} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-title font-bold text-ink">{store.name}</span>
          <Badge tone={badge.tone} shape="tag" size="sm">
            {badge.label}
          </Badge>
        </span>
        <span className="truncate text-[13px] text-ink-muted">
          {store.category} · {store.area} · 최대 {store.maxPartySize}명
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block text-[11px] text-ink-muted">{q.label}</span>
        <span className={cn("block text-lg font-extrabold", q.className)}>{q.value}</span>
      </span>
    </>
  );
}

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/stores/${store.id}`}
      className="flex items-center gap-3 rounded-card border border-line bg-white p-3 shadow-card transition-colors hover:border-line-strong"
    >
      <StoreCardBody store={store} />
    </Link>
  );
}
