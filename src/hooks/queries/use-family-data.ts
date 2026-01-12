import {
  fetchMyFamilies,
  fetchFamilyById,
  fetchFamiliesWithMembers,
} from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

/**
 * 현재 사용자가 속한 가족 목록 조회
 * FamilyRequiredLayout에서 가족 유무 판단에 사용
 */
export function useMyFamilies(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.family.list,
    queryFn: () => fetchMyFamilies(userId!),
    enabled: !!userId,
  });
}

/**
 * 특정 가족 상세 정보 조회
 */
export function useFamilyById(familyId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.family.byId(familyId!),
    queryFn: () => fetchFamilyById(familyId!),
    enabled: !!familyId,
  });
}

/**
 * 특정 사용자가 속한 가족 목록 + 멤버 조회
 * 프로필 페이지에서 사용
 */
export function useFamiliesWithMembers(userId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.family.members(userId!),
    queryFn: () => fetchFamiliesWithMembers(userId!),
    enabled: !!userId,
  });
}
