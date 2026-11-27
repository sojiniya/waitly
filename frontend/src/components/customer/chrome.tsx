import Link from "next/link";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon } from "../icons";

/** 뒤로 가기 + 제목 + 오른쪽 슬롯이 있는 상단 바 */
export function PageHeader({
  backHref,
  title,
  align = "center",
  right,
  className,
}: {
  backHref: string;
  title: string;
  align?: "center" | "left";
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-14 shrink-0 items-center gap-1 border-b border-line bg-white px-3",
        align === "center" && "justify-between",
        className,
      )}
    >
      <Link href={backHref} aria-label="뒤로" className="flex size-11 items-center justify-center rounded-btn">
        <ChevronLeftIcon size={22} />
      </Link>
      <h1 className={cn("text-[17px] font-bold", align === "center" && "absolute left-1/2 -translate-x-1/2")}>{title}</h1>
      {align === "center" && <div className="flex min-w-11 justify-end">{right}</div>}
    </header>
  );
}

/** 화면 아래에 붙는 CTA 영역 */
export function BottomBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 border-t border-line bg-white px-5 pt-3 pb-[max(28px,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
