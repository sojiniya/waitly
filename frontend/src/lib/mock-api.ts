/**
 * 화면에서 부르는 쓰기 API의 목 구현입니다. 지연과 실패 응답(409 등)을 흉내 냅니다.
 * 백엔드가 준비되면 같은 시그니처로 fetch를 호출하도록 바꿉니다.
 */
import { getActiveWaitingAt, getStore } from "./mock-data";
import type { Waiting } from "./types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type RegisterResult =
  | { ok: true; waiting: Waiting }
  | { ok: false; code: "DUPLICATE_WAITING"; existing: Waiting }
  | { ok: false; code: "NOT_ACCEPTING" };

/** POST /api/stores/{storeId}/waitings  (Idempotency-Key 헤더) */
export async function registerWaiting(storeId: number, partySize: number): Promise<RegisterResult> {
  await delay(1400);
  const store = getStore(storeId);
  if (!store || store.status !== "OPEN" || !store.waitingEnabled) return { ok: false, code: "NOT_ACCEPTING" };
  const existing = getActiveWaitingAt(storeId);
  if (existing) return { ok: false, code: "DUPLICATE_WAITING", existing };
  return {
    ok: true,
    waiting: {
      id: 900 + storeId,
      storeId,
      waitingNumber: 20 + store.waitingTeams + storeId,
      partySize,
      status: "WAITING",
      position: store.waitingTeams,
      createdAt: "",
    },
  };
}

export type ReserveResult = { ok: true; reservationId: number } | { ok: false; code: "SLOT_FULL" };

/**
 * POST /api/reservations
 * 마지막 남은 자리를 잡으려는 첫 시도는 "다른 사람이 먼저 확정" 상황(조건부 UPDATE 0건)을 재현합니다.
 */
export async function reserveSlot(params: { seatsLeft: number; partySize: number; alreadyRaced: boolean }): Promise<ReserveResult> {
  await delay(1200);
  if (params.seatsLeft <= params.partySize && !params.alreadyRaced) return { ok: false, code: "SLOT_FULL" };
  return { ok: true, reservationId: 1000 + Math.floor(Math.random() * 1000) };
}

/** DELETE /api/waitings/{id} */
export async function cancelWaiting(): Promise<void> {
  await delay(500);
}

/** PUT /api/owner/stores/{id} */
export async function saveStore(): Promise<void> {
  await delay(800);
}
