"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nowHHMM } from "@/lib/format";
import type { Waiting, WaitingStatus } from "@/lib/types";

export type ConnectionState = "connecting" | "live" | "reconnecting";

export interface WaitingStreamState {
  conn: ConnectionState;
  /** 첫 스냅샷을 받기 전에는 null (순번 자리만 스켈레톤) */
  position: number | null;
  status: WaitingStatus;
  calledAt?: string;
  lastUpdatedAt?: string;
  /** 순번이 줄어들 때마다 1씩 증가 (토스트/애니메이션 키) */
  advancedCount: number;
}

/**
 * 내 웨이팅 실시간 구독.
 *
 * 지금은 목 구현입니다: 1.2초 뒤 연결되고 tickMs마다 앞 팀이 1팀씩 입장합니다.
 * 백엔드가 준비되면 내부를 EventSource(`GET /api/waitings/{id}/stream`)로 바꿉니다.
 * - 연결 직후 스냅샷 이벤트 → position/status 설정
 * - onerror → conn: "reconnecting" (EventSource가 자동 재연결, 마지막 값은 유지)
 */
export function useWaitingStream(initial: Waiting, { tickMs = 3000 } = {}) {
  const [state, setState] = useState<WaitingStreamState>({
    conn: "connecting",
    position: null,
    status: initial.status,
    calledAt: initial.calledAt,
    advancedCount: 0,
  });
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const connect = setTimeout(() => {
      setState((s) => ({ ...s, conn: "live", position: initial.position, lastUpdatedAt: nowHHMM() }));
    }, 1200);

    const tick = setInterval(() => {
      setState((s) => {
        if (s.conn !== "live" || s.status !== "WAITING" || s.position === null) return s;
        if (s.position > 1) {
          return { ...s, position: s.position - 1, advancedCount: s.advancedCount + 1, lastUpdatedAt: nowHHMM() };
        }
        return { ...s, position: 0, status: "CALLED", calledAt: nowHHMM(), lastUpdatedAt: nowHHMM() };
      });
    }, tickMs);

    return () => {
      clearTimeout(connect);
      clearInterval(tick);
      clearTimeout(reconnectTimer.current);
    };
  }, [initial.position, tickMs]);

  /** 데모용: 연결 끊김 → 2.6초 뒤 재연결 */
  const simulateDisconnect = useCallback(() => {
    setState((s) => (s.conn === "live" ? { ...s, conn: "reconnecting" } : s));
    clearTimeout(reconnectTimer.current);
    reconnectTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, conn: "live", lastUpdatedAt: nowHHMM() }));
    }, 2600);
  }, []);

  const markCanceled = useCallback(() => setState((s) => ({ ...s, status: "CANCELED" })), []);

  return { ...state, simulateDisconnect, markCanceled };
}
