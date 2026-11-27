const DOW = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** "2026-11-28" → Date (로컬 자정). 시간대와 상관없이 같은 날짜를 가리킵니다. */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso: string, days: number): string {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function dayOfWeek(iso: string): string {
  return DOW[parseDate(iso).getDay()];
}

/** "11월 28일" */
export function monthDay(iso: string): string {
  const date = parseDate(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** "11월 28일 (토)" */
export function monthDayDow(iso: string): string {
  return `${monthDay(iso)} (${dayOfWeek(iso)})`;
}

/** 이벤트 핸들러 안에서만 호출하세요. 렌더 중에 현재 시각을 읽으면 서버/클라이언트 결과가 달라집니다. */
export function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
