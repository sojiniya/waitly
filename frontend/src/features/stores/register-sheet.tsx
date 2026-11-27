"use client";

import Link from "next/link";
import { useState } from "react";
import { BottomSheet } from "@/components/customer/bottom-sheet";
import { AlertIcon, CheckIcon } from "@/components/icons";
import { Button, buttonClass, Spinner } from "@/components/ui/button";
import { StepperButton } from "@/components/ui/controls";
import { registerWaiting, type RegisterResult } from "@/lib/mock-api";
import type { Store } from "@/lib/types";

type Phase = { kind: "idle" } | { kind: "loading" } | { kind: "result"; result: RegisterResult };

export function RegisterSheet({ store, open, onClose }: { store: Store; open: boolean; onClose: () => void }) {
  const [party, setParty] = useState(2);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const max = store.maxPartySize;
  const loading = phase.kind === "loading";

  const close = () => {
    if (loading) return;
    onClose();
    if (phase.kind === "result") setPhase({ kind: "idle" });
  };

  const submit = async () => {
    if (loading) return; // 두 번 눌러도 요청은 한 번만
    setPhase({ kind: "loading" });
    setPhase({ kind: "result", result: await registerWaiting(store.id, party) });
  };

  const result = phase.kind === "result" ? phase.result : null;

  return (
    <BottomSheet open={open} onClose={close} label="웨이팅 등록" showHandle>
      {result?.ok ? (
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
            <CheckIcon size={28} strokeWidth={2.6} />
          </span>
          <p className="mt-3.5 text-sm text-ink-muted">발급 번호</p>
          <p className="text-[44px] leading-tight font-extrabold tracking-[-0.03em]">{result.waiting.waitingNumber}번</p>
          <p className="mt-0.5 text-body text-ink-strong">
            내 앞에 <b className="text-brand">{result.waiting.position}팀</b> · {result.waiting.partySize}명
          </p>
          <Link href="/waiting" className={buttonClass("primary", "lg", "mt-5 w-full shadow-none")}>
            실시간 순번 보기
          </Link>
        </div>
      ) : result && result.code === "DUPLICATE_WAITING" ? (
        <div>
          <div role="alert" className="rounded-btn border border-danger-line bg-danger-soft px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-body font-bold text-danger">
              <AlertIcon size={18} />
              이미 웨이팅 중인 매장입니다
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-danger">
              {result.existing.waitingNumber}번으로 등록돼 있어요. 기존 순번을 확인해 주세요.
            </p>
          </div>
          <Link href="/waiting" className={buttonClass("dark", "lg", "mt-4 w-full")}>
            내 순번 보기
          </Link>
        </div>
      ) : result ? (
        <div role="alert" className="text-center">
          <p className="text-h2 font-extrabold">지금은 웨이팅을 받지 않아요</p>
          <p className="mt-1 text-sm text-ink-muted">매장 상태가 바뀌었어요. 잠시 후 다시 확인해 주세요.</p>
          <Button variant="secondary" className="mt-5 w-full" onClick={close}>
            닫기
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between">
            <h2 className="text-h2 font-extrabold">몇 분이 오시나요?</h2>
            <span className="text-[13px] text-ink-muted">최대 {max}명</span>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-card border border-line p-3">
            <StepperButton dir="dec" label="인원" value={party} min={1} max={max} onChange={setParty} disabled={loading} size={48} />
            <p className="text-[32px] font-extrabold" aria-live="polite">
              {party}
              <span className="text-[17px] font-semibold">명</span>
            </p>
            <StepperButton dir="inc" label="인원" value={party} min={1} max={max} onChange={setParty} disabled={loading} size={48} />
          </div>
          {party >= max && <p className="mt-2 text-[13px] text-warning">{max + 1}명 이상은 매장에 직접 문의해 주세요.</p>}
          <p className="mt-3.5 text-[13px] leading-relaxed text-ink-sub">
            {store.waitingTeams > 0 ? `등록하면 현재 ${store.waitingTeams}팀 뒤에 줄을 서요. ` : "등록하면 바로 입장 안내를 받아요. "}
            순번은 실시간으로 바뀌고, 호출되면 알려 드려요.
          </p>
          <Button
            className="mt-4.5 w-full shadow-none disabled:bg-brand-busy disabled:text-white"
            disabled={loading}
            aria-busy={loading}
            onClick={submit}
          >
            {loading ? (
              <>
                <Spinner />
                등록하는 중…
              </>
            ) : (
              `${party}명으로 웨이팅 등록`
            )}
          </Button>
        </>
      )}
    </BottomSheet>
  );
}
