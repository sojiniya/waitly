"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import { buttonClass } from "@/components/ui/button";
import { Segmented } from "@/components/ui/controls";

type Mode = "login" | "signup";

const inputClass =
  "h-[50px] rounded-btn border border-line px-3.5 text-body font-normal text-ink placeholder:text-ink-faint";
const labelClass = "flex flex-col gap-1.5 text-[13px] font-semibold text-ink-strong";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const signup = mode === "signup";

  return (
    <div className="flex flex-1 flex-col px-6 pt-14 pb-8">
      <div className="flex items-center gap-2.5">
        <LogoMark className="size-10 rounded-btn" />
        <span className="text-[22px] font-extrabold tracking-[-0.03em]">Waitly</span>
      </div>
      <h1 className="mt-7 text-h1 font-extrabold tracking-[-0.02em]">
        줄은 폰이 서고,
        <br />
        당신은 근처에서 기다리세요
      </h1>
      <p className="mt-2 text-body text-ink-sub">내 순번이 바뀌면 바로 알려 드려요.</p>

      <Segmented
        label="로그인 또는 회원가입"
        value={mode}
        onChange={setMode}
        options={[
          { value: "login", label: "로그인" },
          { value: "signup", label: "회원가입" },
        ]}
        className="mt-7 grid grid-cols-2"
        itemClassName="h-10 text-sm"
      />

      {/* TODO(api): POST /api/auth/login · /api/auth/signup (HttpOnly 쿠키) */}
      <form
        id="auth-form"
        className="mt-5 flex flex-col gap-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/");
        }}
      >
        {signup && (
          <>
            <label className={labelClass}>
              이름
              <input name="name" type="text" autoComplete="name" placeholder="홍길동" required className={inputClass} />
            </label>
            <label className={labelClass}>
              전화번호
              <input name="phone" type="tel" autoComplete="tel" placeholder="010-0000-0000" required className={inputClass} />
            </label>
          </>
        )}
        <label className={labelClass}>
          이메일
          <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required className={inputClass} />
        </label>
        <label className={labelClass}>
          비밀번호
          <input
            name="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            placeholder="8자 이상, 영문·숫자 포함"
            minLength={8}
            required
            className={inputClass}
          />
        </label>
      </form>

      <div className="min-h-8 flex-1" />
      <button type="submit" form="auth-form" className={buttonClass("primary", "lg", "w-full")}>
        {signup ? "가입하고 시작하기" : "로그인"}
      </button>
      <p className="mt-3.5 text-center text-[13px] text-ink-muted">
        점주이신가요?{" "}
        <Link href="/owner" className="font-bold text-ink underline underline-offset-2 hover:text-brand">
          점주 센터로 이동
        </Link>
      </p>
    </div>
  );
}
