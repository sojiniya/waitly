"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function HistoryTabs({ waitingCount, reservationCount }: { waitingCount: number; reservationCount: number }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/history", label: `웨이팅 ${waitingCount}`, on: pathname === "/history" },
    { href: "/history/reservations", label: `예약 ${reservationCount}`, on: pathname === "/history/reservations" },
  ];
  return (
    <nav aria-label="내역 종류" className="mt-3.5 flex gap-5">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={t.on ? "page" : undefined}
          className={cn(
            "flex h-11 items-center border-b-2 text-body font-bold",
            t.on ? "border-ink text-ink" : "border-transparent text-ink-muted",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
