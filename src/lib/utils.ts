import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 6자리 랜덤 초대 코드 생성
 * 혼동되기 쉬운 문자(0, O, I, 1, L) 제외
 */
export function generateInviteCode(length: number = 6): string {
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

/**
 * 상대적 시간 표시 (예: "1시간 전", "3일 전")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  // 7일 이상이면 날짜 표시
  return date.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

/**
 * 내 가족 멤버십 데이터에서 가족 탭용 데이터 추출
 */
export function extractFamilyMemberships<
  T extends { family: { id: string; name: string } | null },
>(familiesWithMembers: T[]): Array<{ id: string; name: string }> {
  return familiesWithMembers.map((m) => m.family).filter(Boolean) as Array<{
    id: string;
    name: string;
  }>;
}
