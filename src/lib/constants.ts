import type { PostCategory } from "@/types";

export const QUERY_KEYS = {
  userProfile: {
    all: ["userProfile"],
    list: ["userProfile", "list"],
    byId: (userId: string) => ["userProfile", userId],
  },
  family: {
    all: ["family"],
    list: ["family", "list"], // 내가 속한 가족 목록
    byId: (familyId: string) => ["family", familyId], // 특정 가족 상세 정보
    // members: (familyId: string) => ["family", familyId, "members"], // 가족 멤버 목록
    members: (userId: string) => ["family", "members", userId], // 내 가족 목록과 멤버 목록 조회
    memberById: (familyId: string, userId: string) => [
      "family",
      "memberById",
      familyId,
      userId,
    ],
  },
  post: {
    all: ["post"],
    // list: (familyId: string) => ["post", "list", familyId],
    // 리스트: ID 배열만 반환 (무한스크롤용 캐시 정규화 작업)
    list: (familyId: string, category?: PostCategory) => [
      "post",
      "list",
      familyId,
      { category },
    ],
    byId: (postId: number) => ["post", postId],
  },
  postComment: {
    all: ["postComment"],
    byPostId: (postId: number) => ["postComment", "byPostId", postId],
  },
};

export const BUCKET_NAME = "okuri-storage";

export const STORAGE_PATHS = {
  userAvatar: (userId: string) => `users/${userId}/avatars`,
  familyCover: (familyId: string) => `families/${familyId}/cover`,
  familyMemberAvatar: (familyId: string, userId: string) =>
    `families/${familyId}/members/${userId}`,
  postImages: (familyId: string, userId: string, postId: string) =>
    `families/${familyId}/posts/${userId}/${postId}`,
  galleryAlbum: (familyId: string, albumId: string) =>
    `families/${familyId}/gallery/${albumId}`,
} as const;
