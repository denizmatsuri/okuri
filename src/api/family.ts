import supabase from "@/utils/supabase";
import type { FamilyEntity, FamilyMember, FamilyWithMembers } from "@/types";
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
 * 특정 사용자가 속한 가족 목록과 각 가족의 멤버 리스트 조회
 * 프로필 페이지, index 페이지 "내 가족" 섹션에서 사용
 */
export async function fetchFamiliesWithMembers(
  userId: string,
): Promise<FamilyWithMembers[]> {
  // 1. 사용자가 속한 가족 ID 목록 가져오기
  const { data: memberships, error: membershipError } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", userId);

  if (membershipError) throw membershipError;
  if (!memberships || memberships.length === 0) return [];

  const familyIds = memberships.map((m) => m.family_id);

  // 2. 해당 가족들의 상세 정보 가져오기
  const { data: families, error: familiesError } = await supabase
    .from("families")
    .select("*")
    .in("id", familyIds);

  if (familiesError) throw familiesError;
  if (!families) return [];

  // 3. 각 가족의 멤버 정보 가져오기 (유저 정보 포함)
  const { data: allMembers, error: membersError } = await supabase
    .from("family_members")
    .select(
      `
      *,
      user:users (
        id,
        email,
        display_name,
        avatar_url,
        birth_date,
        phone_number,
        notification,
        created_at
      )
    `,
    )
    .in("family_id", familyIds)
    .order("joined_at", { ascending: true });

  if (membersError) throw membersError;

  // 4. 가족별로 멤버 그룹핑
  const result: FamilyWithMembers[] = families.map((family) => ({
    ...family,
    members: (allMembers || []).filter(
      (m) => m.family_id === family.id,
    ) as FamilyMember[],
  }));

  return result;
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
