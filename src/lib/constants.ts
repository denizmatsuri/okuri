import type { PostCategory } from "@/types";

export const QUERY_KEYS = {
  userProfile: {
    all: ["userProfile"],
    list: ["userProfile", "list"],
    byId: (userId: string) => ["userProfile", "byId", userId],
  },
  family: {
    all: ["family"],
    list: ["family", "list"], // 내가 속한 가족 목록
    byId: (familyId: string) => ["family", "byId", familyId], // 현재 내가 선택한 가족 상세 정보
    familiesWithMembersByUserId: (userId: string) => [
      "family",
      "withMembers",
      "byUserId",
      userId,
    ], // 내 가족 목록 + 멤버 목록(+유저정보) 조회
  },
  post: {
    all: ["post"],
    /**
     * prefix matching용 (invalidateQueries, resetQueries)
     * 해당 가족의 모든 카테고리 리스트를 한 번에 무효화/리셋할 때 사용
     */
    listByFamily: (familyId: string) => ["post", "list", familyId],
    /**
     * 정확한 매칭용 (useQuery, useInfiniteQuery, setQueryData)
     * 특정 카테고리의 리스트를 읽거나 쓸 때 사용
     */
    list: (familyId: string, category?: PostCategory) => [
      "post",
      "list",
      familyId,
      { category },
    ],
    byId: (postId: number) => ["post", "byId", postId],
  },
  postComment: {
    all: ["postComment"],
    byPostId: (postId: number) => ["postComment", "byPostId", postId],
  },
};

export const BUCKET_NAME = "okuri-storage";

export const STORAGE_PATHS = {
  userAvatar: (userId: string) => `users/${userId}/avatars`,
  // familyCover: (familyId: string) => `families/${familyId}/cover`,
  // familyMemberAvatar: (familyId: string, userId: string) => `families/${familyId}/members/${userId}`,
  postImages: (familyId: string, userId: string, postId: string) =>
    `families/${familyId}/posts/${userId}/${postId}`,
  // galleryAlbum: (familyId: string, albumId: string) => `families/${familyId}/gallery/${albumId}`,
} as const;

export const STALE_TIME = {
  STATIC: Infinity, // 직접 변경 전까지 유효
  SEMI_STATIC: 1000 * 60 * 10, // 10분
  DYNAMIC: 1000 * 60 * 5, // 5분
  REALTIME: 1000 * 30, // 30초
} as const;
