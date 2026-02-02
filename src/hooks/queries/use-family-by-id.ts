import { fetchFamilyById } from "@/api/family";
import { QUERY_KEYS, STALE_TIME } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

/**
 * 특정 가족 상세 정보 조회
 */
export function useFamilyById(familyId?: string, userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.family.byId(familyId!),
    queryFn: () => fetchFamilyById(familyId!),
    enabled: !!familyId && !!userId,
    staleTime: STALE_TIME.SEMI_STATIC,
  });
}
