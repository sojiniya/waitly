/**
 * 고객 화면 프레임: 휴대폰에서는 화면을 꽉 채우고,
 * 768px 이상에서는 최대 480px 카드로 가운데 정렬합니다 (_design_ref/데스크톱 카드 프레임).
 */
export default function CustomerLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh bg-surface md:py-10">
      <div className="relative mx-auto flex min-h-dvh max-w-[480px] flex-col bg-white md:min-h-[min(844px,calc(100dvh-80px))] md:overflow-clip md:rounded-frame md:border md:border-line md:shadow-frame">
        {children}
      </div>
    </div>
  );
}
