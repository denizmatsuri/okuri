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
export type PostCommentEntity =
  Database["public"]["Tables"]["post_comments"]["Row"];

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
// export type ActiveFamilyContext = {
//   family: FamilyEntity;
//   membership: FamilyMemberEntity;
// };

// 프로필 표시용 (간소화된 버전)
// export type DisplayProfile = {
//   displayName: string;
//   avatarUrl: string;
//   familyRole?: string;
// };

// 게시글 + 작성자 정보 (가족 내 프로필 우선 표시)
export type Post = PostEntity & {
  familyMember: FamilyMember;
  isLiked: boolean;
};

// 댓글 + 작성자 정보 (가족 내 프로필 우선 표시)
export type Comment = PostCommentEntity & {
  familyMember: FamilyMember; // user의 avatarURL정보도 필요해서
};

/**
 * 계층형 댓글 구조를 위한 타입
 *
 * 트리 구조로 댓글과 대댓글을 표현하며, 재귀적 타입을 사용하여
 * 무한 깊이의 댓글 스레드를 지원.
 *
 * @example
 * 댓글 1 (parentComment: undefined)
 *   ㄴ 대댓글 1-1 (parentComment: 댓글 1)
 *      ㄴ 대댓글 1-1-1 (parentComment: 대댓글 1-1)
 *      ㄴ 대댓글 1-1-2 (parentComment: 대댓글 1-1-1)
 *      ㄴ 대댓글 1-1-3 (parentComment: 대댓글 1-1)
 *   ㄴ 대댓글 1-2 (parentComment: 댓글 1)
 */
export type NestedComment = Comment & {
  /**
   * 부모 댓글 참조
   * - undefined: 최상위 댓글 (루트 댓글)
   * - Comment: 대댓글인 경우 부모 댓글 객체
   */
  parentComment?: Comment;

  /**
   * 자식 댓글 배열 (대댓글들)
   * - 재귀적 타입: NestedComment[]로 정의되어 무한 깊이의 댓글 트리 구현 가능
   * - 빈 배열: 대댓글이 없는 경우
   */
  children: NestedComment[];
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
