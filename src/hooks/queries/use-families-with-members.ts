import { fetchFamiliesWithMembers } from "@/api/family";
import { QUERY_KEYS, STALE_TIME } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

/**
 * 특정 사용자가 속한 가족 목록 + 멤버 + 유저 정보 조회
 * 프로필 페이지에서 사용
 */
export function useFamiliesWithMembers(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.family.familiesWithMembersByUserId(userId!),
    queryFn: () => fetchFamiliesWithMembers(userId!),
    enabled: !!userId,
    staleTime: STALE_TIME.SEMI_STATIC,
  });
}
