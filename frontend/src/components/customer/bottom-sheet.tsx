"use client";

import { useEffect, useRef } from "react";

/**
 * 아래에서 올라오는 시트. 네이티브 <dialog>로 포커스 가두기와 Esc 닫기를 처리합니다.
 */
export function BottomSheet({
  open,
  onClose,
  label,
  showHandle = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  showHandle?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/45 open:flex open:items-end"
    >
      <div className="mx-auto w-full max-w-[480px] animate-sheet rounded-t-sheet bg-white px-5 pt-6 pb-[max(28px,env(safe-area-inset-bottom))]">
        {showHandle && <div aria-hidden="true" className="mx-auto -mt-3.5 mb-4.5 h-1 w-10 rounded-full bg-line" />}
        {children}
      </div>
    </dialog>
  );
}
