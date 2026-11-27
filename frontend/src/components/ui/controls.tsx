"use client";

import { cn } from "@/lib/cn";

/* ---------- 인원 스테퍼 (− n +) ---------- */

interface StepperButtonsProps {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  /** 버튼 한 변 길이(px) */
  size?: 32 | 44 | 48;
  label: string;
}

const STEP_SIZE = { 32: "size-8 rounded-lg text-base", 44: "size-11 rounded-btn text-xl", 48: "size-12 rounded-btn text-2xl" } as const;

export function StepperButton({
  dir,
  ...p
}: StepperButtonsProps & { dir: "dec" | "inc" }) {
  const off = p.disabled || (dir === "dec" ? p.value <= p.min : p.value >= p.max);
  return (
    <button
      type="button"
      aria-label={`${p.label} ${dir === "dec" ? "줄이기" : "늘리기"}`}
      disabled={off}
      onClick={() => p.onChange(dir === "dec" ? p.value - 1 : p.value + 1)}
      className={cn(
        "flex shrink-0 items-center justify-center border border-line bg-white leading-none text-ink disabled:text-line-strong",
        STEP_SIZE[p.size ?? 44],
      )}
    >
      {dir === "dec" ? "−" : "+"}
    </button>
  );
}

/* ---------- 토글 스위치 ---------- */

interface SwitchProps {
  checked: boolean;
  onChange?: (next: boolean) => void;
  label: string;
  size?: "sm" | "md";
  className?: string;
  children?: React.ReactNode;
}

export function SwitchTrack({ checked, size = "sm" }: { checked: boolean; size?: "sm" | "md" }) {
  const md = size === "md";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative shrink-0 rounded-full transition-colors duration-200",
        md ? "h-6.5 w-11" : "h-6 w-10",
        checked ? "bg-brand" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.2)] transition-[left] duration-200",
          md ? "size-5" : "size-4.5",
          checked ? (md ? "left-[21px]" : "left-[19px]") : "left-[3px]",
        )}
      />
    </span>
  );
}

export function Switch({ checked, onChange, label, size, className, children }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={children ? undefined : label}
      onClick={() => onChange?.(!checked)}
      className={className}
    >
      {children}
      <SwitchTrack checked={checked} size={size} />
    </button>
  );
}

/* ---------- 세그먼트 컨트롤 (로그인/회원가입, 영업 상태) ---------- */

interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: string; activeClass?: string }[];
  onChange: (next: T) => void;
  label: string;
  className?: string;
  itemClassName?: string;
}

export function Segmented<T extends string>({ value, options, onChange, label, className, itemClassName }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex gap-1 rounded-btn bg-fill p-1", className)}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-[9px] font-bold transition-colors",
              on ? cn("bg-white shadow-toggle", o.activeClass ?? "text-ink") : "text-ink-muted",
              itemClassName,
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
