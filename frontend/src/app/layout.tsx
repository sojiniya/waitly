import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// 한글 글리프는 unicode-range 조각으로 나뉘어 있어 미리 불러오지 않습니다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Waitly",
    template: "%s · Waitly",
  },
  description: "매장에 원격으로 줄을 서고, 내 순번이 바뀌는 순간 바로 확인하세요.",
};

export const viewport: Viewport = {
  themeColor: "#FF5A36",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKr.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
