"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BellIcon, ChevronDownIcon, ChevronRightIcon, SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { CATEGORIES, type Category, type Store, type Waiting } from "@/lib/types";
import { StoreCard } from "./store-card";

type Filter = "전체" | Category;

/** 대기 적은 순: 바로 받을 수 있는 매장 → 접수 마감 → 일시 중지 → 영업 종료 */
function rank(s: Store) {
  if (s.status === "OPEN" && s.waitingEnabled) return 0;
  if (s.status === "OPEN") return 1;
  if (s.status === "PAUSED") return 2;
  return 3;
}

export function StoreList({
  stores,
  activeWaiting,
}: {
  stores: Store[];
  activeWaiting?: { waiting: Waiting; storeName: string };
}) {
  const [filter, setFilter] = useState<Filter>("전체");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim();
    return stores
      .filter((s) => filter === "전체" || s.category === filter)
      .filter((s) => !q || s.name.includes(q) || s.category.includes(q) || s.area.includes(q))
      .toSorted((a, b) => rank(a) - rank(b) || a.waitingTeams - b.waitingTeams);
  }, [stores, filter, query]);

  return (
    <>
      <header className="flex flex-col gap-3 bg-white px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-1 text-h2 font-extrabold">
            성수동
            <ChevronDownIcon size={18} strokeWidth={2.2} />
          </h1>
          <button
            type="button"
            aria-label="알림 (준비 중)"
            aria-disabled="true"
            className="flex size-11 items-center justify-center rounded-btn text-ink"
          >
            <BellIcon size={22} />
          </button>
        </div>
        <label className="flex h-11.5 items-center gap-2 rounded-btn bg-fill px-3.5 text-ink-muted">
          <SearchIcon size={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="매장 이름, 메뉴 검색"
            aria-label="매장 검색"
            className="min-w-0 flex-1 bg-transparent text-body text-ink outline-none placeholder:text-ink-muted"
          />
        </label>
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none]" role="group" aria-label="카테고리">
          {(["전체", ...CATEGORIES] as Filter[]).map((c) => {
            const on = c === filter;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c)}
                className={cn(
                  "flex h-8.5 shrink-0 items-center rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap",
                  on ? "bg-ink text-white" : "border border-line bg-white text-ink",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-2 bg-surface px-4 py-3">
        {activeWaiting && (
          <Link href="/waiting" className="flex items-center gap-3 rounded-card bg-ink px-4 py-3.5 text-white">
            <span className="size-2.5 shrink-0 rounded-full bg-brand shadow-[0_0_0_4px_rgb(255_90_54/0.25)]" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
              {activeWaiting.storeName} · {activeWaiting.waiting.waitingNumber}번{" "}
              <span className="text-brand-pale">내 앞에 {activeWaiting.waiting.position}팀</span>
            </span>
            <ChevronRightIcon size={18} />
          </Link>
        )}

        <div className="flex items-center justify-between px-1 pt-1">
          <h2 className="text-body font-bold">
            내 주변 매장 <span className="font-medium text-ink-muted">{visible.length}</span>
          </h2>
          <span className="text-[13px] text-ink-sub">대기 적은 순</span>
        </div>

        {visible.map((s) => (
          <StoreCard key={s.id} store={s} />
        ))}

        {visible.length === 0 && (
          <div className="rounded-card border border-dashed border-line-strong px-4 py-8 text-center">
            <p className="text-body font-bold">조건에 맞는 매장이 없어요</p>
            <p className="mt-1 text-[13px] text-ink-muted">다른 이름이나 카테고리로 찾아보세요.</p>
          </div>
        )}
      </main>
    </>
  );
}
