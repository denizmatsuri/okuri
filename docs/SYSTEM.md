# System Design

**project:** Okuri
**date:** 2025-12-26
**version:** 1.0 (초안)

---

## 🛠 Tech Stack

### Frontend

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Library**: shadcn/ui (Radix UI 기반)
- **Router**: React Router v7
- **Icons**: Lucide React
- **Toast**: Sonner

### State Management

- **Global State**: Zustand
- **Server State**: TanStack Query v5
  - Queries: 데이터 조회 (캐싱, refetch)
  - Mutations: 데이터 변경 (낙관적 업데이트)

### Backend

- **BaaS**: Supabase
  - Auth (인증)
  - PostgreSQL (데이터베이스)
  - Storage (파일 저장)
  - Real-time (선택적)

---

## 🏗 Architecture

### Data Flow

1. **UI 이벤트 발생** (사용자 인터랙션)
2. **TanStack Query Hook 호출** (`useQuery` / `useMutation`)
3. **API 함수 실행** (`src/api/[feature].ts`)
4. **Supabase Client 요청** (Auth, DB, Storage)
5. **응답 캐싱** (TanStack Query)
6. **UI 업데이트** (자동 리렌더링)

---

## 📁 Folder Structure

```
src/
├── api/                  # Supabase API 호출 함수 (순수 함수)
│   ├── auth.ts           # 인증 관련 API
│   ├── album.ts          # 사진첩 API
│   ├── family.ts         # 가족 그룹 API
│   ├── post.ts           # 게시글 API (공지사항, 펑 포함)
│   └── calendar.ts       # 캘린더 API
│
├── assets/               # 정적 파일 (이미지, 폰트)
│   └── default-avatar.png
│
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── ui/               # shadcn/ui 기본 컴포넌트 (수정 금지)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layout/           # Header, Sidebar, Navigation 등
│   │   ├── root-layout.tsx
│   │   ├── bottom-navigation.tsx
│   │   └── header.tsx
│   ├── common/           # 공통 컴포넌트
│   │   ├── loader.tsx
│   │   ├── fallback.tsx
│   │   └── error-boundary.tsx
│   ├── post/             # 게시글 전용 컴포넌트
│   │   ├── post-item.tsx
│   │   ├── notice-item.tsx
│   │   ├── pung-item.tsx
│   │   ├── post-form.tsx
│   │   └── category-filter.tsx # 전체글/공지사항/펑 필터
│   ├── blog/             # 블로그 전용 컴포넌트
│   └── calendar/         # 캘린더 전용 컴포넌트
│
├── hooks/                # Custom React Hooks
│   ├── queries/          # TanStack Query (useQuery)
│   │   ├── use-feed-list.ts
│   │   └── use-blog-detail.ts
│   └── mutations/        # TanStack Query (useMutation)
│       ├── feed/
│       │   ├── use-create-feed.ts
│       │   └── use-like-feed.ts
│       └── blog/
│           └── use-create-blog.ts
│
├── lib/                  # 유틸리티, 상수, 설정
│   ├── utils.ts          # 범용 유틸리티 (cn 함수 등)
│   ├── constants.ts      # 상수 정의 (QUERY_KEYS 등)
│   ├── supabase.ts       # Supabase Client 초기화
│   └── error-messages.ts # 에러 메시지 매핑
│
├── pages/                # 페이지 컴포넌트 (라우트 단위)
│   ├── index-page.tsx    # 홈(피드)
│   ├── calendar-page.tsx # 일정
│   ├── calendar-page.tsx # 캘린더
│   ├── album-page.tsx    # 사진첩
│   └── sign-in-page.tsx  # 로그인
│
├── provider/             # Context Provider
│   └── theme-provider.tsx
│
├── store/                # Zustand 스토어 (전역 상태)
│   ├── session.ts        # 사용자 세션
│   └── theme.ts          # 다크모드 설정
│
├── types.ts              # 공통 타입 정의
├── database.types.ts     # Supabase 자동 생성 타입 (수정 금지)
├── App.tsx               # 라우팅 설정
└── main.tsx              # 앱 진입점 (Provider 설정)
```

### 파일 명명 규칙

- **파일명**: `kebab-case` (예: `feed-item.tsx`)
- **컴포넌트명**: `PascalCase` (예: `FeedItem`)
- **훅**: `use-` 접두사 (예: `use-feed-list.ts`)
