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
  },
  post: {
    all: ["post"],
    list: (familyId: string) => ["post", "list", familyId],
    byId: (postId: number) => ["post", postId],
  },
};

export const BUCKET_NAME = "okuri-storage";

// FIXME: 삭제해도 될듯
export const STORAGE_PATHS = {
  userAvatar: (userId: string) => `users/${userId}/avatars`,
  familyCover: (familyId: string) => `families/${familyId}/cover`,
  familyMemberAvatar: (familyId: string, userId: string) =>
    `families/${familyId}/members/${userId}`,
  // postImages: (familyId: string) => `families/${familyId}/posts`,
  galleryAlbum: (familyId: string, albumId: string) =>
    `families/${familyId}/gallery/${albumId}`,
} as const;
