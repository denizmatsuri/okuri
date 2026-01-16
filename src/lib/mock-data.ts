/**
 * UI 프로토타이핑용 Mock 데이터
 * 실제 API 연동 시 삭제 예정
 */

import defaultAvatar from "@/assets/default-avatar.jpg";

export const REACTION_TYPES = {
  love: { emoji: "❤️", label: "좋아요" },
  haha: { emoji: "😂", label: "웃겨요" },
  wow: { emoji: "😮", label: "놀라워요" },
  sad: { emoji: "😢", label: "슬퍼요" },
  cheer: { emoji: "💪", label: "응원해요" },
} as const;

export type ReactionType = keyof typeof REACTION_TYPES;

// 리액션 집계 타입
export type ReactionSummary = {
  [key in ReactionType]: number;
};

export type MockPost = {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
  isNotice?: boolean;
};

export const mockPosts: MockPost[] = [
  {
    id: "1",
    authorName: "김희수",
    authorRole: "아들",
    authorAvatar: defaultAvatar,
    content: "오늘 날씨가 정말 좋네요! 공원에서 산책했어요 🌸",
    imageUrls: [],
    createdAt: "2026-01-15T09:00:00Z",
  },
  {
    id: "2",
    authorName: "박건남",
    authorRole: "엄마",
    authorAvatar: defaultAvatar,
    content: "저녁 메뉴는 뭘로 할까요? 오늘은 김치찌개 어때요?",
    imageUrls: [],
    createdAt: "2026-01-15T08:30:00Z",
  },
  {
    id: "3",
    authorName: "김종학",
    authorRole: "아빠",
    authorAvatar: defaultAvatar,
    content:
      "이번 주말에 가족 여행 계획 세워봐요! 어디로 갈까요?\n\n후보지:\n1. 강릉\n2. 부산\n3. 제주도",
    imageUrls: [],
    createdAt: "2026-01-14T20:00:00Z",
  },
  {
    id: "4",
    authorName: "김희수",
    authorRole: "아들",
    authorAvatar: defaultAvatar,
    content: "[공지] 설날 모임은 1월 28일(토) 오후 2시입니다!",
    imageUrls: [],
    createdAt: "2026-01-14T10:00:00Z",
    isNotice: true,
  },
  {
    id: "5",
    authorName: "박건남",
    authorRole: "엄마",
    authorAvatar: defaultAvatar,
    content: "오늘 만든 반찬 사진이에요~",
    imageUrls: [
      "https://picsum.photos/400/300",
      "https://picsum.photos/400/300",
      "https://picsum.photos/400/300",
    ],
    createdAt: "2026-01-13T15:00:00Z",
  },
];

// 가족 탭용 간단한 데이터
export const mockFamilyTabs = [
  { id: "1", name: "희수네" },
  { id: "2", name: "종학네" },
];
