export const QUERY_KEYS = {
  userProfile: {
    all: ["userProfile"],
    list: ["userProfile", "list"],
    byId: (userId: string) => ["userProfile", userId],
  },
  family: {
    all: ["family"],
    list: ["family", "list"], // 내가 속한 가족 목록
    byId: (familyId: string) => ["family", familyId], // 특정 가족 상세
    members: (familyId: string) => ["family", familyId, "members"], // 가족 멤버 목록
  },
};

export const BUCKET_NAME = "okuri-storage";

export const STORAGE_PATHS = {
  userAvatar: (userId: string) => `users/${userId}/avatars`,
  familyCover: (familyId: string) => `families/${familyId}/cover`,
  familyMemberAvatar: (familyId: string, userId: string) =>
    `families/${familyId}/members/${userId}`,
  postImages: (familyId: string, postId: string) =>
    `families/${familyId}/posts/${postId}`,
  galleryAlbum: (familyId: string, albumId: string) =>
    `families/${familyId}/gallery/${albumId}`,
} as const;
