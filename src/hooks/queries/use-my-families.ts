import { fetchMyFamilies } from "@/api/family";
import { QUERY_KEYS, STALE_TIME } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

/**
 * 현재 사용자가 속한 가족 목록 조회
 */
export function useMyFamilies(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.family.list,
    queryFn: () => fetchMyFamilies(userId!),
    enabled: !!userId,
    staleTime: STALE_TIME.SEMI_STATIC,
  });
}
