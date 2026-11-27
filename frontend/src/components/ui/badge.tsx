import { cn } from "@/lib/cn";
import type { ReservationStatus, StoreStatus, WaitingStatus } from "@/lib/types";

export type BadgeTone =
  | "info"
  | "imminent"
  | "called"
  | "neutral"
  | "muted"
  | "danger"
  | "success"
  | "warning";

const TONE: Record<BadgeTone, string> = {
  info: "bg-info-soft text-info",
  imminent: "bg-brand-soft text-brand-ink",
  called: "bg-brand text-white",
  neutral: "bg-fill text-ink-strong",
  muted: "bg-fill text-ink-muted",
  danger: "bg-danger-soft text-danger",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
};

interface BadgeProps {
  tone: BadgeTone;
  /** pill: 상태 배지(둥근 알약) · tag: 매장 목록의 작은 사각 태그 */
  shape?: "pill" | "tag";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

export function Badge({ tone, shape = "pill", size = "md", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center font-bold whitespace-nowrap",
        shape === "pill" ? "rounded-full" : "rounded-md",
        size === "md" ? "px-2.5 py-1 text-xs" : "px-[7px] py-0.5 text-[11px]",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ---------- 상태값 → 배지 ---------- */

export function waitingBadge(status: WaitingStatus, opts: { imminent?: boolean } = {}): { tone: BadgeTone; label: string } {
  switch (status) {
    case "WAITING":
      return opts.imminent ? { tone: "imminent", label: "입장 임박" } : { tone: "info", label: "대기 중" };
    case "CALLED":
      return { tone: "called", label: "호출됨" };
    case "SEATED":
      return { tone: "neutral", label: "착석" };
    case "CANCELED":
      return { tone: "muted", label: "취소" };
    case "NO_SHOW":
      return { tone: "danger", label: "노쇼" };
  }
}

export function reservationBadge(status: ReservationStatus): { tone: BadgeTone; label: string } {
  switch (status) {
    case "CONFIRMED":
      return { tone: "success", label: "예약 확정" };
    case "VISITED":
      return { tone: "neutral", label: "방문 완료" };
    case "CANCELED":
      return { tone: "muted", label: "취소" };
    case "NO_SHOW":
      return { tone: "danger", label: "노쇼" };
  }
}

export function storeBadge(status: StoreStatus): { tone: BadgeTone; label: string } {
  switch (status) {
    case "OPEN":
      return { tone: "success", label: "영업 중" };
    case "PAUSED":
      return { tone: "warning", label: "일시 중지" };
    case "CLOSED":
      return { tone: "neutral", label: "영업 종료" };
  }
}

/** 남은 자리 배지: 마감 / 잔여 1(임박) / 잔여 n */
export function seatsBadge(left: number): { tone: BadgeTone; label: string } {
  if (left <= 0) return { tone: "neutral", label: "마감" };
  if (left === 1) return { tone: "imminent", label: "잔여 1" };
  return { tone: "success", label: `잔여 ${left}` };
}
