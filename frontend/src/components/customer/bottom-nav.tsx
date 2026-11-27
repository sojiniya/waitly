"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { CalendarIcon, ClockIcon, HomeIcon, ListIcon } from "../icons";

const TABS = [
  { href: "/", label: "홈", Icon: HomeIcon, match: (p: string) => p === "/" },
  { href: "/waiting", label: "내 웨이팅", Icon: ClockIcon, match: (p: string) => p.startsWith("/waiting") },
  { href: "/history/reservations", label: "예약", Icon: CalendarIcon, match: (p: string) => p.startsWith("/history/reservations") },
  { href: "/history", label: "내역", Icon: ListIcon, match: (p: string) => p === "/history" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-10 grid h-[calc(76px+env(safe-area-inset-bottom))] shrink-0 grid-cols-4 border-t border-line bg-white pb-[max(12px,env(safe-area-inset-bottom))]"
    >
      {TABS.map(({ href, label, Icon, match }) => {
        const on = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-[3px] text-[11px]",
              on ? "font-bold text-brand" : "font-semibold text-ink-muted",
            )}
          >
            <Icon size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
