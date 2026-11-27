// docs/design.md ERD와 같은 이름과 상태값을 씁니다. 백엔드 응답 DTO가 생기면 이 파일을 기준으로 맞춥니다.

export type StoreStatus = "OPEN" | "PAUSED" | "CLOSED";
export type WaitingStatus = "WAITING" | "CALLED" | "SEATED" | "CANCELED" | "NO_SHOW";
export type ReservationStatus = "CONFIRMED" | "CANCELED" | "VISITED" | "NO_SHOW";

export const CATEGORIES = ["한식", "일식", "양식", "카페", "고기"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Store {
  id: number;
  name: string;
  /** 사진이 없을 때 썸네일에 쓰는 글자. 없으면 이름 첫 글자 */
  mark?: string;
  category: Category;
  address: string;
  /** 목록에 보이는 짧은 위치 (예: 연무장길) */
  area: string;
  status: StoreStatus;
  waitingEnabled: boolean;
  maxPartySize: number;
  /** 현재 대기 팀 수 (WAITING 상태) */
  waitingTeams: number;
  /** 호출 후 입장까지 기다려 주는 시간(분) */
  callGraceMinutes: number;
}

export interface Waiting {
  id: number;
  storeId: number;
  /** 발급 번호 (불변) */
  waitingNumber: number;
  partySize: number;
  status: WaitingStatus;
  /** 내 앞에 남은 팀 수. 저장하지 않고 Redis ZRANK로 계산되는 값 */
  position: number;
  createdAt: string;
  calledAt?: string;
}

export interface ReservationSlot {
  id: number;
  storeId: number;
  slotDate: string;
  startTime: string;
  capacity: number;
  reservedCount: number;
}

export interface Reservation {
  id: number;
  storeId: number;
  slotDate: string;
  startTime: string;
  partySize: number;
  status: ReservationStatus;
}

/** 점주 대기열 한 줄 */
export interface QueueEntry {
  waitingNumber: number;
  partySize: number;
  createdAt: string;
  status: Extract<WaitingStatus, "WAITING" | "CALLED">;
  calledAt?: string;
}

/** 점주 예약 상세 패널의 예약자 */
export interface SlotBooking {
  maskedName: string;
  maskedPhone: string;
  partySize: number;
  status: ReservationStatus;
}
