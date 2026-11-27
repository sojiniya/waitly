import type { Metadata } from "next";
import { OwnerSidebar } from "@/features/owner/owner-sidebar";

export const metadata: Metadata = {
  title: { default: "점주 센터", template: "%s · Waitly 점주 센터" },
};

export default function OwnerLayout({ children }: LayoutProps<"/owner">) {
  return (
    <div className="min-h-dvh bg-surface md:flex">
      <OwnerSidebar />
      <main className="flex min-w-0 flex-1 flex-col gap-4.5 px-4 py-5 md:px-7 md:pt-6 md:pb-8">{children}</main>
    </div>
  );
}
