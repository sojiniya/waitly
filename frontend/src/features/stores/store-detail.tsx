"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomBar } from "@/components/customer/chrome";
import { BowlIcon, CheckIcon, ChevronLeftIcon, PinIcon } from "@/components/icons";
import { Badge, storeBadge } from "@/components/ui/badge";
import { Button, buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { CATEGORY_TINT } from "@/lib/mock-data";
import type { Store } from "@/lib/types";
import { RegisterSheet } from "./register-sheet";

function acceptState(store: Store) {
  if (store.status === "CLOSED") return "closed" as const;
  if (store.status === "PAUSED") return "paused" as const;
  if (!store.waitingEnabled) return "off" as const;
  return "open" as const;
}

const NOTICE = {
  paused: "잠시 웨이팅을 멈췄어요. 기존 대기 팀은 그대로 유지돼요.",
  off: "오늘 웨이팅 접수를 마감했어요. 예약은 아직 가능해요.",
  closed: "오늘 영업을 마쳤어요. 다른 날짜로 예약할 수 있어요.",
} as const;

export function StoreDetail({ store, slotsLeftToday }: { store: Store; slotsLeftToday: number }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const state = acceptState(store);
  const tint = CATEGORY_TINT[store.category];
  const badge = storeBadge(store.status);
  const reserveHref = `/stores/${store.id}/reserve`;

  return (
    <>
      <div className="relative flex h-[220px] shrink-0 items-center justify-center" style={{ backgroundColor: tint.bg }}>
        <BowlIcon size={96} strokeWidth={1.2} style={{ color: tint.fg }} />
        <Link
          href="/"
          aria-label="뒤로"
          className="absolute top-3 left-3 flex size-11 items-center justify-center rounded-btn bg-white shadow-[0_2px_8px_rgb(17_24_39/0.08)]"
        >
          <ChevronLeftIcon size={22} />
        </Link>
      </div>

      <main className="relative -mt-5 flex flex-1 flex-col gap-4 rounded-t-sheet bg-white px-5 pt-5.5 pb-6">
        <div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={badge.tone} shape="tag" className="px-2 py-[3px]">
              {badge.label}
            </Badge>
            {state === "off" && (
              <Badge tone="neutral" shape="tag" className="px-2 py-[3px]">
                웨이팅 마감
              </Badge>
            )}
            <Badge tone="neutral" shape="tag" className="px-2 py-[3px] font-semibold">
              {store.category}
            </Badge>
          </div>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-[-0.02em]">{store.name}</h1>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-ink-sub">
            <PinIcon size={15} />
            {store.address}
          </p>
          {state !== "open" && <p className="mt-3 text-sm leading-relaxed text-ink-sub">{NOTICE[state]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="현재 대기" value={store.waitingTeams} unit="팀" />
          <Stat label="한 팀 최대" value={store.maxPartySize} unit="명" />
        </div>

        {state === "open" && store.waitingTeams === 0 && (
          <div className="flex items-center gap-3 rounded-card bg-success-soft px-4 py-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-success">
              <CheckIcon size={20} strokeWidth={2.6} />
            </span>
            <div>
              <p className="text-sm font-bold text-success">지금 바로 입장할 수 있어요</p>
              <p className="text-[13px] text-ink-sub">등록하면 바로 입장 안내를 받아요.</p>
            </div>
          </div>
        )}

        <dl className="flex flex-col gap-2.5 rounded-card bg-surface px-4 py-3.5 text-sm">
          <InfoRow label="웨이팅 접수">
            <span className={cn("font-semibold", state === "open" ? "text-success" : "text-ink-muted")}>
              {state === "open" ? "받는 중" : state === "paused" ? "잠시 중지" : "마감"}
            </span>
          </InfoRow>
          <InfoRow label="예약">
            <span className="font-semibold">{slotsLeftToday > 0 ? `오늘 잔여 ${slotsLeftToday}타임` : "오늘 마감"}</span>
          </InfoRow>
          <InfoRow label="호출 후 입장 시간">
            <span className="font-semibold">{store.callGraceMinutes}분</span>
          </InfoRow>
        </dl>
      </main>

      <BottomBar className="flex gap-2">
        {state === "open" && (
          <>
            <Link href={reserveHref} className={buttonClass("secondary", "lg", "flex-1 text-base")}>
              예약하기
            </Link>
            <Button className="flex-2" onClick={() => setSheetOpen(true)}>
              웨이팅 등록
            </Button>
          </>
        )}
        {state === "paused" && (
          <Button disabled className="flex-1">
            지금은 웨이팅을 받지 않아요
          </Button>
        )}
        {(state === "off" || state === "closed") && (
          <>
            <Button disabled className="flex-1">
              {state === "off" ? "웨이팅 마감" : "영업 종료"}
            </Button>
            <Link href={reserveHref} className={buttonClass("primary", "lg", "flex-1")}>
              예약하기
            </Link>
          </>
        )}
      </BottomBar>

      {state === "open" && <RegisterSheet store={store} open={sheetOpen} onClose={() => setSheetOpen(false)} />}
    </>
  );
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-card border border-line p-3.5">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-0.5 text-2xl font-extrabold">
        {value}
        <span className="text-body">{unit}</span>
      </p>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
