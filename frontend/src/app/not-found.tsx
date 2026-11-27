import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface px-6 text-center">
      <p className="text-sm font-bold text-brand-ink">404</p>
      <h1 className="mt-2 text-h2 font-extrabold">찾는 페이지가 없어요</h1>
      <p className="mt-1.5 text-sm text-ink-muted">주소가 바뀌었거나 없어진 매장일 수 있어요.</p>
      <Link href="/" className={buttonClass("primary", "md", "mt-6 shadow-none")}>
        매장 목록으로
      </Link>
    </div>
  );
}
