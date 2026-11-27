import Link from "next/link";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function HistoryGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="px-1 pt-1.5 text-[13px] font-bold text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}

export function HistoryItem({
  store,
  badge,
  meta,
  right,
  href,
  live,
}: {
  store: string;
  badge: { tone: BadgeTone; label: string };
  meta: string;
  right: string;
  href?: string;
  live?: boolean;
}) {
  const className = cn(
    "flex items-center gap-3 rounded-card border bg-white px-4 py-3.5 shadow-card",
    live ? "border-brand-line" : "border-line",
    href && "transition-colors hover:border-line-strong",
  );
  const body = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-body font-bold text-ink">{store}</span>
          <Badge tone={badge.tone} size="sm" className="px-2">
            {badge.label}
          </Badge>
        </span>
        <span className="text-[13px] text-ink-muted">{meta}</span>
      </span>
      <span className="shrink-0 text-[13px] font-bold text-ink-sub">{right}</span>
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}
