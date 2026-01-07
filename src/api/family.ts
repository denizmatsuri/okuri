import supabase from "@/utils/supabase";
import type { FamilyEntity } from "@/types";

/**
 * 현재 로그인한 사용자가 속한 가족 목록 조회
 * family_members 테이블에서 user_id로 필터링 후 families 조인
 */
export async function fetchMyFamilies(userId: string) {
  const { data, error } = await supabase
    .from("family_members")
    .select(
      `
      id,
      display_name,
      family_role,
      avatar_url,
      is_admin,
      joined_at,
      family:families (
        id,
        name,
        description,
        created_at,
        created_by
      )
    `,
    )
    .eq("user_id", userId);

  if (error) throw error;
  return data;
}

/**
 * 특정 가족 상세 정보 조회
 */
export async function fetchFamilyById(familyId: string) {
  const { data, error } = await supabase
    .from("families")
    .select("*")
    .eq("id", familyId)
    .single();

  if (error) throw error;
  return data as FamilyEntity;
}

/**
 * 특정 가족의 멤버 목록 조회 (유저 정보 포함)
 */
export async function fetchFamilyMembers(familyId: string) {
  const { data, error } = await supabase
    .from("family_members")
    .select(
      `
      *,
      user:users (
        id,
        email,
        display_name,
        avatar_url,
        birth_date
      )
    `,
    )
    .eq("family_id", familyId)
    .order("joined_at", { ascending: true });

  if (error) throw error;
  return data;
}
