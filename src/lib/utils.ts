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
