/**
 * 백엔드 API가 붙기 전까지 쓰는 화면용 목 데이터입니다.
 * 값은 _design_ref 프로토타입과 같게 맞췄습니다. API가 생기면 이 파일의 함수를 fetch로 바꿉니다.
 */
import { addDays, dayOfWeek } from "./format";
import type {
  Category,
  QueueEntry,
  Reservation,
  ReservationSlot,
  SlotBooking,
  Store,
  Waiting,
} from "./types";

/** 목 데이터 기준일. 서버 렌더와 브라우저 렌더가 같은 날짜를 보도록 고정합니다. */
export const MOCK_TODAY = "2026-11-26";

/** 정기 휴무 요일 */
const CLOSED_DOW = "월";

export const STORES: Store[] = [
  {
    id: 1,
    name: "성수 소금집",
    mark: "소",
    category: "한식",
    address: "서울 성동구 연무장길 12, 1층",
    area: "연무장길",
    status: "OPEN",
    waitingEnabled: true,
    maxPartySize: 6,
    waitingTeams: 4,
    callGraceMinutes: 10,
  },
  {
    id: 2,
    name: "모노 커피로스터스",
    category: "카페",
    address: "서울 성동구 성수이로 88",
    area: "성수이로",
    status: "OPEN",
    waitingEnabled: true,
    maxPartySize: 6,
    waitingTeams: 0,
    callGraceMinutes: 10,
  },
  {
    id: 3,
    name: "오르조 파스타바",
    category: "양식",
    address: "서울 성동구 서울숲길 43, 2층",
    area: "서울숲길",
    status: "OPEN",
    waitingEnabled: true,
    maxPartySize: 6,
    waitingTeams: 11,
    callGraceMinutes: 10,
  },
  {
    id: 6,
    name: "르방 베이커리",
    category: "카페",
    address: "서울 성동구 성수일로 7",
    area: "성수일로",
    status: "OPEN",
    waitingEnabled: false,
    maxPartySize: 4,
    waitingTeams: 0,
    callGraceMinutes: 10,
  },
  {
    id: 4,
    name: "니카이도 라멘",
    category: "일식",
    address: "서울 광진구 아차산로 21",
    area: "아차산로",
    status: "PAUSED",
    waitingEnabled: true,
    maxPartySize: 6,
    waitingTeams: 3,
    callGraceMinutes: 10,
  },
  {
    id: 5,
    name: "화로상회",
    category: "고기",
    address: "서울 성동구 뚝섬로 17",
    area: "뚝섬로",
    status: "CLOSED",
    waitingEnabled: false,
    maxPartySize: 6,
    waitingTeams: 0,
    callGraceMinutes: 10,
  },
];

/** 매장 썸네일 색 (카테고리별) */
export const CATEGORY_TINT: Record<Category, { bg: string; fg: string }> = {
  한식: { bg: "#FFF1EC", fg: "#FF5A36" },
  일식: { bg: "#FEF3C7", fg: "#B45309" },
  양식: { bg: "#EEF2FF", fg: "#4338CA" },
  카페: { bg: "#F5F0EA", fg: "#7C5A3A" },
  고기: { bg: "#F3F4F6", fg: "#6B7280" },
};

export function getStores(): Store[] {
  return STORES;
}

export function getStore(id: number): Store | undefined {
  return STORES.find((s) => s.id === id);
}

/** 내가 지금 서 있는 웨이팅 (고객 1명 기준 목 데이터) */
export const MY_ACTIVE_WAITING: Waiting = {
  id: 501,
  storeId: 1,
  waitingNumber: 37,
  partySize: 2,
  status: "WAITING",
  position: 4,
  createdAt: "18:21",
};

export function getActiveWaitingAt(storeId: number): Waiting | undefined {
  return MY_ACTIVE_WAITING.storeId === storeId ? MY_ACTIVE_WAITING : undefined;
}

export const MY_PAST_WAITINGS: (Waiting & { date: string })[] = [
  { id: 480, storeId: 3, waitingNumber: 112, partySize: 3, status: "SEATED", position: 0, createdAt: "19:02", date: "2026-11-22" },
  { id: 471, storeId: 4, waitingNumber: 58, partySize: 1, status: "CANCELED", position: 0, createdAt: "12:40", date: "2026-11-18" },
  { id: 455, storeId: 2, waitingNumber: 9, partySize: 2, status: "NO_SHOW", position: 0, createdAt: "10:15", date: "2026-11-09" },
];

export const MY_RESERVATIONS: Reservation[] = [
  { id: 91, storeId: 1, slotDate: "2026-11-28", startTime: "19:00", partySize: 4, status: "CONFIRMED" },
  { id: 84, storeId: 5, slotDate: "2026-11-15", startTime: "18:30", partySize: 2, status: "VISITED" },
  { id: 77, storeId: 3, slotDate: "2026-11-02", startTime: "12:00", partySize: 2, status: "CANCELED" },
  { id: 70, storeId: 1, slotDate: "2026-10-25", startTime: "20:00", partySize: 3, status: "NO_SHOW" },
];

/* ---------- 예약 슬롯 ---------- */

const SLOT_TEMPLATE: { time: string; capacity: number; reserved: number }[] = [
  { time: "17:00", capacity: 4, reserved: 4 },
  { time: "17:30", capacity: 4, reserved: 2 },
  { time: "18:00", capacity: 6, reserved: 5 },
  { time: "18:30", capacity: 6, reserved: 6 },
  { time: "19:00", capacity: 8, reserved: 5 },
  { time: "19:30", capacity: 8, reserved: 4 },
  { time: "20:00", capacity: 6, reserved: 4 },
  { time: "20:30", capacity: 6, reserved: 0 },
];

/** 오늘부터 n일 (ISO 날짜) */
export function upcomingDates(n = 7): string[] {
  return Array.from({ length: n }, (_, i) => addDays(MOCK_TODAY, i));
}

export function isClosedDay(date: string): boolean {
  return dayOfWeek(date) === CLOSED_DOW;
}

export function getSlots(storeId: number, date: string): ReservationSlot[] {
  if (isClosedDay(date)) return [];
  const offset = upcomingDates(14).indexOf(date);
  return SLOT_TEMPLATE.map((t, k) => {
    // 오늘은 프로토타입 값 그대로, 이후 날짜는 조금씩 비게 만듭니다.
    const loosen = offset > 0 && (offset + k) % 3 === 0 ? Math.min(offset, 2) : 0;
    return {
      id: storeId * 10_000 + Math.max(offset, 0) * 100 + k,
      storeId,
      slotDate: date,
      startTime: t.time,
      capacity: t.capacity,
      reservedCount: Math.max(0, t.reserved - loosen),
    };
  });
}

const MASKED_NAMES = ["정*윤", "한*서", "김*연", "박*준", "이*아", "최*호"];
const BOOKING_STATUS: SlotBooking["status"][] = ["CONFIRMED", "CONFIRMED", "VISITED", "CONFIRMED"];

/** 점주 화면: 슬롯 하나의 예약자 목록 */
export function getSlotBookings(slot: ReservationSlot): SlotBooking[] {
  const bookings: SlotBooking[] = [];
  let left = slot.reservedCount;
  let k = 0;
  while (left > 0) {
    const party = Math.min(left, 2 + (k % 2));
    bookings.push({
      maskedName: MASKED_NAMES[(k + (slot.id % 6)) % MASKED_NAMES.length],
      maskedPhone: `010-****-${2442 + k * 417 + (slot.id % 100) * 33}`,
      partySize: party,
      status: BOOKING_STATUS[k % BOOKING_STATUS.length],
    });
    left -= party;
    k += 1;
  }
  return bookings;
}

/* ---------- 점주 대기열 ---------- */

export const OWNER_STORE_ID = 1;

export const OWNER_QUEUE: QueueEntry[] = [
  { waitingNumber: 36, partySize: 4, createdAt: "18:14", status: "CALLED", calledAt: "18:39" },
  { waitingNumber: 37, partySize: 2, createdAt: "18:21", status: "WAITING" },
  { waitingNumber: 38, partySize: 3, createdAt: "18:25", status: "WAITING" },
  { waitingNumber: 39, partySize: 2, createdAt: "18:30", status: "WAITING" },
  { waitingNumber: 40, partySize: 5, createdAt: "18:33", status: "WAITING" },
  { waitingNumber: 41, partySize: 1, createdAt: "18:36", status: "WAITING" },
];

export const OWNER_TODAY_STATS = { seated: 18, noShow: 1 };
