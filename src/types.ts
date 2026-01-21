import { type Database } from "@/database.types";

// ============================================
// Entity 타입 (DB 테이블 직접 매핑)
// ============================================
export type UserEntity = Database["public"]["Tables"]["users"]["Row"];
export type FamilyEntity = Database["public"]["Tables"]["families"]["Row"];
export type FamilyMemberEntity =
  Database["public"]["Tables"]["family_members"]["Row"];
export type PostEntity = Database["public"]["Tables"]["posts"]["Row"];
export type PostLikeEntity = Database["public"]["Tables"]["post_likes"]["Row"];

// ============================================
// 조인/확장 타입 (헬퍼 타입)
// ============================================

// 가족 멤버 + 유저 정보
export type FamilyMember = FamilyMemberEntity & {
  user: UserEntity;
};

// 가족 + 멤버 리스트(가족 멤버 + 유저 정보)
export type FamilyWithMembers = FamilyEntity & {
  members: FamilyMember[];
};

// 현재 활성 가족 컨텍스트
export type ActiveFamilyContext = {
  family: FamilyEntity;
  membership: FamilyMemberEntity;
};

// 프로필 표시용 (간소화된 버전)
export type DisplayProfile = {
  displayName: string;
  avatarUrl: string;
  familyRole?: string;
};

// 게시글 타입
export type Post = PostEntity & {
  familyMember: FamilyMember;
  isLiked: boolean;
};

// 게시글 카테고리
export type PostCategory = "all" | "general" | "notice";

/**
 * React Query useMutation 훅의 콜백 타입
 *
 * 커스텀 mutation 훅에서 생명주기 콜백을 외부 주입받아
 * 컴포넌트별로 다른 후처리 로직을 적용할 수 있게 합니다.
 */
export type MutationCallbacks = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
