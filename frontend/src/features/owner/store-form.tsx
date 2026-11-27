"use client";

import { useState } from "react";
import { Button, Spinner } from "@/components/ui/button";
import { Switch } from "@/components/ui/controls";
import { cn } from "@/lib/cn";
import { saveStore } from "@/lib/mock-api";
import { CATEGORIES, type Store, type StoreStatus } from "@/lib/types";
import { StoreCardBody } from "../stores/store-card";
import { OwnerCard, OwnerPageTitle } from "./page-title";

const inputClass = "h-12 rounded-btn border border-line bg-white px-3.5 text-body font-normal text-ink";
const labelClass = "flex flex-col gap-2 text-[13px] font-semibold text-ink-strong";

const STATUS_LABEL: Record<StoreStatus, string> = { OPEN: "영업 중", PAUSED: "일시 중지", CLOSED: "영업 종료" };

export function StoreForm({ initial }: { initial: Store }) {
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = <K extends keyof Store>(key: K, value: Store[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setNotice(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty || saving) return;
    setSaving(true);
    await saveStore();
    setSaved(draft);
    setSaving(false);
    setNotice("저장했어요. 고객 화면에 바로 반영돼요.");
  };

  return (
    <>
      <OwnerPageTitle
        title="매장 정보"
        description="고객 앱의 매장 목록과 상세 화면에 그대로 보여요"
        actions={
          <>
            <Button variant="secondary" size="md" disabled={!dirty || saving} onClick={() => setDraft(saved)}>
              취소
            </Button>
            <Button type="submit" form="store-form" size="md" className="px-5 shadow-none" disabled={!dirty || saving} aria-busy={saving}>
              {saving ? <Spinner /> : "저장하기"}
            </Button>
          </>
        }
      />

      <p role="status" className={cn("text-sm font-semibold text-success", !notice && "sr-only")}>
        {notice}
      </p>

      <div className="flex flex-wrap items-start gap-4">
        <OwnerCard className="min-w-0 flex-[3_1_460px]">
          <form id="store-form" onSubmit={submit} className="flex flex-col gap-5 p-6">
            <label className={labelClass}>
              매장 이름
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value, mark: undefined }))}
                required
                maxLength={30}
                className={inputClass}
              />
            </label>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-[13px] font-semibold text-ink-strong">카테고리</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => {
                  const on = draft.category === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("category", c)}
                      className={cn(
                        "h-9.5 rounded-full border px-4 text-sm",
                        on ? "border-brand bg-brand-soft font-bold text-brand-ink" : "border-line bg-white font-semibold text-ink-strong",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className={labelClass}>
              주소
              <input value={draft.address} onChange={(e) => set("address", e.target.value)} required className={inputClass} />
            </label>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                한 팀 최대 인원
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={20}
                  value={draft.maxPartySize}
                  onChange={(e) => set("maxPartySize", Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                영업 상태
                <select
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value as StoreStatus)}
                  className={cn(inputClass, "px-3")}
                >
                  {(Object.keys(STATUS_LABEL) as StoreStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Switch
              checked={draft.waitingEnabled}
              onChange={(v) => set("waitingEnabled", v)}
              label="웨이팅 접수"
              size="md"
              className="flex items-center justify-between gap-4 rounded-btn bg-surface p-4 text-left"
            >
              <span>
                <span className="block text-sm font-bold">웨이팅 접수</span>
                <span className="mt-0.5 block text-[13px] text-ink-muted">끄면 고객 화면의 등록 버튼이 비활성화돼요</span>
              </span>
            </Switch>
          </form>
        </OwnerCard>

        <section className="flex min-w-0 flex-[2_1_300px] flex-col gap-2.5" aria-labelledby="preview-label">
          <h2 id="preview-label" className="text-[13px] font-bold text-ink-muted">
            고객 화면 미리보기
          </h2>
          <div className="flex items-center gap-3 rounded-card border border-line bg-white p-3.5 shadow-raised">
            <StoreCardBody store={draft} thumbClassName="size-16" />
          </div>
          <div className="rounded-card border border-dashed border-line-strong p-4.5 text-[13px] leading-relaxed text-ink-sub">
            매장 사진은 [대표 사진 업로드] 자리예요. 정사각형 1:1, 1200px 이상을 권장해요.
          </div>
        </section>
      </div>
    </>
  );
}
