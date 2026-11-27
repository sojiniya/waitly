"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarIcon, ListIcon, StoreIcon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/cn";

const MENU = [
  { href: "/owner", label: "대기열 관리", Icon: ListIcon },
  { href: "/owner/slots", label: "예약 슬롯", Icon: CalendarIcon },
  { href: "/owner/store", label: "매장 정보", Icon: StoreIcon },
];

export function OwnerSidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-line bg-white px-4 pt-4 pb-3 md:sticky md:top-0 md:h-dvh md:w-[260px] md:shrink-0 md:border-r md:border-b-0 md:pt-6">
      <Link href="/owner" className="flex items-center gap-2.5 px-2 pb-3 md:pb-5">
        <LogoMark className="size-8.5 rounded-[10px]" iconSize={20} />
        <span>
          <span className="block text-title font-extrabold">Waitly</span>
          <span className="block text-xs text-ink-muted">점주 센터</span>
        </span>
      </Link>
      <nav aria-label="점주 메뉴" className="flex gap-1 overflow-x-auto md:flex-col">
        {MENU.map(({ href, label, Icon }) => {
          const on = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex h-11 shrink-0 items-center gap-2.5 rounded-btn px-3 text-sm whitespace-nowrap",
                on ? "bg-brand-soft font-bold text-brand-ink" : "font-semibold text-ink-strong hover:bg-surface",
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
