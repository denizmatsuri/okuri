import supabase from "@/utils/supabase";
import type { FamilyEntity } from "@/types";
import { generateInviteCode } from "@/lib/utils";

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

/**
 * 가족 생성 및 어드민 권한 생성자 프로필 등록
 */
export async function createFamilyWithMember({
  name,
  description,
  userId,
  displayName,
  familyRole,
}: {
  // 가족 정보
  name: string;
  description?: string;
  // 생성자 프로필
  userId: string;
  displayName: string;
  familyRole?: string;
}) {
  // 1. 가족 생성
  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({
      name,
      description,
      created_by: userId,
      invite_code: generateInviteCode(),
    })
    .select()
    .single();

  if (familyError) throw familyError;

  // 2. 생성자를 admin으로 등록
  const { data: member, error: memberError } = await supabase
    .from("family_members")
    .insert({
      family_id: family.id,
      user_id: userId,
      display_name: displayName,
      family_role: familyRole,
      is_admin: true,
    })
    .select()
    .single();

  if (memberError) {
    // 롤백 시도 (완벽하지 않음)
    await supabase.from("families").delete().eq("id", family.id);
    throw memberError;
  }

  return { family, member };
}

/**
 * 초대 코드 재생성 (관리자 전용)
 * 새로운 6자리 코드 생성 후 DB 업데이트
 */
export async function regenerateInviteCode(familyId: string) {
  const newCode = generateInviteCode();

  const { data, error } = await supabase
    .from("families")
    .update({
      invite_code: newCode,
      // 필요시 만료 시간 설정
      // invite_code_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq("id", familyId)
    .select("invite_code")
    .single();

  if (error) throw error;
  return data;
}
