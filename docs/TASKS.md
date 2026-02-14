# Project Plan & Task Tracker

## 🎯 목표

1차 버전: 커뮤니티 핵심 기능 MVP 완성
핵심지표: 회원가입 + 글작성 + 댓글

2차 버전: 추가 기능 개발

---

## 📆 개발 타임라인

| 기간          | 주요 목표                                         |
| ------------- | ------------------------------------------------- |
| 12/24 ~ 12/24 | ✅ 프로젝트 환경 세팅 (~ Milestone 2)             |
| 12/26 ~ 12/26 | ✅ 기초 디자인 및 프로젝트 페이지 설계            |
| 12/26 ~ 12/27 | ✅ 앱 구조 및 라우팅 세팅                         |
| 12/29 ~ 12/30 | ✅ 수파베이스 연동, Auth(Email)                   |
| 01/02         | ✅ Auth(Email)                                    |
| 01/05 ~ 01/08 | ✅ 회원정보 수정                                  |
| 01/12 ~ 01/14 | ✅ 가족 그룹 시스템 (Core System)                 |
| 01/15 ~ 01/22 | ✅ 피드(Post)                                     |
| 01/21         | ✅ 피드 좋아요                                    |
| 01/22         | ✅ 피드 댓글                                      |
| 01/26         | ✅ 리팩토링을 위한 디자인패턴 디깅 작업 및 문서화 |
| 01/27         | ✅ 리팩토링(UI, 로직 분리)                        |
| 01/28 ~ 01/29 | ✅ 성능 및 캐싱 최적화 작업                       |
| 01/28 ~ 01/29 | ✅ UI/UX 작업                                     |
| 02/02         | ✅ 추가기능 작업(소셜로그인, 알림)                |
| 02/03         | ✅ 배포                                           |

---

## 🏁 진행 현황

- [x] **Milestone 1: 프로젝트 환경 세팅**
  - [x] Vite + React 19 + TypeScript 프로젝트 초기화
  - [x] 프로젝트 가이드라인 설정 (.cursor/rules/)
  - [x] 폴더 구조 설계 (api, components, hooks, lib, pages, provider, store)
  - [x] 라이브러리 설치 (Tailwind CSS, React Router, Zustand, TanStack Query)
  - [x] main.tsx 파일 세팅 (TanStack Query, React Router)
  - [x] Prettier(+Tailwind CSS) 세팅
        `npm i -D prettier prettier-plugin-tailwindcss`
  - [x] .gitignore 및 .env 환경변수 설정

- [x] **Milestone 2: 스타일링 환경 구축**
  - [x] shadcn/ui 세팅
  - [x] 기본 UI 컴포넌트 추가 (button, input, dialog, textarea, alert-dialog, ...)
  - [x] 개발 중 와이어프레임 스타일 가이드 적용
    - 모든 컴포넌트에 border 적용 (명확한 구분)
    - 직각적인 느낌 유지 (rounded-none or rounded-sm)

- [x] **Milestone 3: 앱 구조 및 라우팅 세팅**
  - [x] 프로젝트 기본 구조 설계(MVP 수준)
  - [x] RootRoute 컴포넌트라우트 구조 설계(MVP 수준)
  - [x] 기본 페이지 컴포넌트 세팅 (ex: pages/index-page.tsx, pages/sign-in-page)
  - [x] 반응형 디자인 적용 (모바일/태블릿/데스크톱)
  - [x] GlobalLayout 컴포넌트 구현 (Header, Main, Navigation)

- [x] **Milestone 4: Supabase 연동**
  - [x] Supabase 프로젝트 생성 및 환경변수 설정
  - [x] Supabase Client 초기화 (utils/supabase.ts)
  - [x] 타입 자동 생성 스크립트 설정 (npm run type-gen)
  - [x] Database 타입 정의 및 Entity 타입 추출 (types.ts)

  > 📖 상세 가이드: [Supabase 설정 가이드](./guides/supabase-setup.md)

- [x] **Milestone 5: Auth(인증 시스템 구축)**
  - [x] Supabase Auth 설정 및 환경변수 구성
  - [x] users 테이블 설계 (가족 그룹 시스템 염두)
  - [x] 회원가입 기능
  - [x] 회원가입시 프로필 자동생성 (supabase trigger 함수 사용)
  - [x] SessionProvider(Zustand) 세션관리 구현
  - [x] 리다이렉션 로직 구현
    - [x] GuestOnlyLayout / MemberOnlyLayout 보호 라우트 구현
  - [x] 로그인 기능
  - [x] 로그아웃 기능
  - [x] 메뉴버튼 추가 및 로그아웃 기능
  - [x] 비밀번호 재설정 기능 (이메일 전송)
  - [x] 인증 에러 처리 (sonner 통합)
  - [x] Supabase 에러 메시지 한글로 번역
  - [x] 인증 시스템 검토 (자체 테스트)
    - [x] 로그인, 회원가입, 비밀번호 재설정 리다이렉션 확인

- [x] **Milestone 6: 가족 그룹 시스템 (Core)**
  - [x] 가족 그룹 DB 스키마 설계 및 생성
    - [x] families 테이블 (그룹 정보)
    - [x] family_members 테이블 (구성원-역할 매핑)
    - [x] database.types.ts 재생성 (`npm run type-gen`)
    - [x] types.ts에 가족 관련 타입 추가
  - [x] 프로필페이지: 회원 정보 수정(닉네임, 이미지)
    - [x] `profile-page.tsx` UI 구현 (정보 표시 + 수정 폼)
    - [x] 프로필 업데이트 기능
      - [x] `api/profile.ts` - updateUserProfile 함수 추가
      - [x] `use-update-profile.ts` mutation 훅
    - [x] 이미지 업로드 (Supabase Storage)
      - [x] Supabase Storage 버킷 생성 (avatars)
      - [x] `api/image.ts` - 버킷 Image 업로드 및 삭제 함수
    - [x] 프로필 + 아바타 이미지 수정 기능 - [x] `api/profile.ts`
  - [x] 페이지 라우트 & 온보딩
    - [x] 초기값 세팅: 가족관련 추가
    - [x] 가족 페이지 라우트 구조 추가
    - [x] no-family-page.tsx UI 구현
    - [x] index-page 리다이렉트 로직 (가족 유무)
  - [x] 가족 생성 (Page + API + Hook)
    - [x] `create-family-page.tsx` UI 구현
    - [x] `api/family.ts` - createFamily 함수
    - [x] `use-create-family.ts` mutation 훅
    - [x] ⚠️Family Provider로 가족 관련 데이터를 전역관리
      - [x] Tanstack Query로 가족 데이터 캐싱 (families, members 등)
        - [x] `use-my-families.ts` query 훅
      - [x] Zustand로 currentFamilyId persist 저장
        - [x] `store/family.ts` 현재 가족 상태
      - [x] FamilyProvider를 이용해 가족 목록 프리페칭 + currentFamilyId 유효성 검증/설정
  - [x] 가족 가입 (Page + API + Hook)
    - [x] `join-family-page.tsx` UI 구현
    - [x] `api/family.ts` - joinFamily, validateCode
    - [x] `use-join-family.ts` mutation 훅
  - [x] 초대 관리
    - [x] `family-invite-page.tsx` UI 구현
    - [x] 초대코드 복사/공유 기능
    - [x] `use-regenerate-invite-code.ts` 초대코드 재생성 기능 추가
  - [x] 가족 정보 & 전환 UI
    - [x] `profile-page.tsx` 내 가족 UI 구현
      1. API 함수 구현 `src/api/family.ts`
      2. QUERY_KEYS 추가 (`src/lib/constants.ts`)
      3. Query 훅 추가 (`src/hooks/queries/use-family-data.ts`)
      4. 프로필 페이지 수정 (`src/pages/auth/profile-page.tsx`)
  - [x] 초대 코드로 가입하기 구현 (26/01/12)
  - [x] 가족방 설정 기능 (관리자전용)
  - [x] 멤버 관리 (관리자전용)
    - [x] 멤버 내보내기 기능
    - [x] families테이블 created_by 컬럼삭제 및 동기화 -> admins로 관리하기 위해 무의미해짐.
    - [x] 가족 멤버 탈퇴 기능 + 확인 다이얼로그
    - [x] 관리자 권한 부여기능, 가족 멤버에게
    - [x] 가족 삭제 (관리자) + 경고
    - [x] 관리자 회원 탈퇴시 경고 (생성한 모든 가족방 삭제됨)
  - [x] 수정작업 (26/01/13)
    - [x] admin이 아닌 사용자도 family setting페이지에서 정보보기 가능 (input들 비활성화)
    - [x] 가족 멤버 나가기 및 탈퇴는 수정버튼을 눌러서 family setting 페이지에서 진행하기
  - [x] 마무리 (26/01/14)
    - [x] ⚠️ 가족멤버 프로필 수정기능
      - [x] 가족리스트에서 avatar를 클릭할시 popup으로 띄워서 본인일 경우 수정
    - [x] RLS (Row Level Security) 정책 추가, storage 포함
    - [x] 통합 테스트 및 버그 수정

  > 📖 상세 가이드: [가족 그룹 시스템 설계](./feature/family-group.md)

- [x] **Milestone 7: Index Page CRUD 작업(게시글)**
  - [x] UI 프로토타이핑 (Mock Data)
    - [x] `post-feed.tsx` 게시글 목록 UI
    - [x] `lib/mock-data.ts` Mock 데이터 생성
    - [x] 상단 가족 탭 UI (내 가족 목록 표시)
    - [x] 카테고리 필터 UI (전체/일반/공지사항)
    - [x] `components/post/post-item.tsx` 개별 게시글 컴포넌트
    - [x] `components/post/post-detail-page.tsx` 게시글 디테일 페이지
    - [x] `components/post/post-form.tsx` 작성 폼 UI
  - [x] DB 작업 (Supabase Dashboard)
    - [x] posts 테이블 생성 (SQL Editor)
    - [x] post-images Storage 버킷 생성 및
    - [x] `npm run type-gen` 실행
    - [x] `types.ts`에 Post 관련 타입 추가
    - [x] `lib/constants.ts`에 QUERY_KEYS.posts, 추가
  - [x] 게시글 작성 (🗓️ 26/01/15)
    - [x] `api/post.ts` - createPost 함수
    - [x] `hooks/mutations/post/use-create-post.ts`
    - [x] `components/post/post-form.tsx` 작성 폼 UI
    - [x] 카테고리 선택 UI (일반/공지사항)
    - [x] 이미지 업로드 기능 (다중)
  - [x] 게시글 목록 조회 (API 연결)
    - [x] `api/post.ts` - fetchPosts 함수 (가족ID, 카테고리 필터)
    - [x] `hooks/queries/use-posts-data.ts` Query 훅
    - [x] Mock → 실제 데이터로 교체
  - [x] ⚠️ 가족선택 기능 (zustand persist로 local저장 및 query 변경)
  - [x] ⚠️ 전역 모달 관리를 위한 ModalProvider 구현 (createPortal, zustand) (🗓️ 26/01/16)
  - [x] ⚠️ Post 캐시 정규화 작업 및 무한스크롤 작업 (🗓️ 26/01/19)
    - 리스트는 id만 가져오고, 실제 데이터는 byId로 넣어서 보여주기
  - [x] 게시글 수정
    - [x] `api/post.ts` - updatePost 함수
    - [x] `hooks/mutations/post/use-update-post.ts`
    - [x] 수정 모드 UI (post-form 재사용)
    - [x] 이미지 수정기능
  - [x] 게시글 삭제
    - [x] `api/post.ts` - deletePost 함수
    - [x] `hooks/mutations/post/use-delete-post.ts`
  - [x] RLS 작업 (🗓️ 26/01/21)
    - [x] posts 테이블 RLS 정책 설정
    - [x] post-images Storage RLS 정책 설정
    - [x] 통합 테스트 및 버그 수정

  > 📖 상세 가이드: [게시글 시스템 설계](./feature/post.md)

- [x] **Milestone 8: 게시글 좋아요 기능**

  DB & 타입 기반 작업
  - [x] post_like 테이블 생성
  - [x] toggle_like RPC 함수 생성
    - FOR UPDATE로 행 잠금 (동시성 제어: 동시에 유저가 같이 클릭 대처)
    - 좋아요 존재 여부에 따라 INSERT/DELETE
    - like_count 증가/감소 처리
    - boolean 반환 (true: 추가, false: 제거)
  - [x] `npm run type-gen` 실행
  - [x] types.ts 업데이트
    - [x] PostLikeEntity 타입 추출
    - [x] post 타입에 isLiked 필드 추가(내가 좋아요 눌렀는지)

  API 레이어
  - [x] `api/post.ts`
    - [x] toggleLike 함수 (RPC 호출)
  - [x] 기존 fetchPosts 함수 수정
    - [x] like 테이블 조인하여 myLiked 조회
    - [x] isLiked 필드 계산 로직 추가(내가 좋아요 눌렀는지)

  상태 관리 (TanStack Query)
  - [x] `use-toggle-post-like.ts` mutation 훅 생성
    - [x] mutationFn: toggleLike
    - [x] onMutate: 낙관적 업데이트
      - 진행 중인 쿼리 취소
      - 현재 상태 백업
      - isLiked, like_count UI 즉시 업데이트
    - [x] onError: 롤백 처리
    - [x] onSuccess: 콜백 실행

  UI 컴포넌트
  - [x] `like-button.tsx` 컴포넌트 생성
    - [x] Props: id, likeCount, isLiked
    - [x] 로그인 상태 체크 (useSession)
    - [x] 좋아요 토글 핸들러
    - [x] 하트 아이콘 + 카운트 UI
    - [ x] 좋아요 상태에 따른 스타일 (fill 여부)
  - [x] 부모 컴포넌트에 LikeButton 통합

  보안 & 마무리
  - [x] RLS 정책 설정
    - [x] SELECT: 인증된 사용자 전체 조회 가능
    - [x] INSERT: 본인의 좋아요만 추가 가능
    - [x] DELETE: 본인의 좋아요만 삭제 가능
  - [x] 테스트
    - [x] 좋아요 추가/제거 동작 확인
    - [x] 낙관적 업데이트 확인
    - [x] 에러 시 롤백 확인
    <!-- - [ ] 동시성 테스트 (여러 사용자 동시 좋아요) -->

  > 📖 상세 가이드: [좋아요 시스템 설계](./feature/post-like.md)

- [x] **Milestone 9: Post 댓글 시스템**

  DB & 타입 기반 작업
  - [x] post_comment 테이블 생성
  - [x] `npm run type-gen` 실행
  - [x] types.ts 업데이트
    - [x] CommentEntity 타입 추출
    - [x] Comment 타입 정의 (CommentEntity + author: ProfileEntity)
    - [x] NestedComment 타입 정의 (계층형 댓글용)

  API 레이어
  - [x] `api/comment.ts` 생성
    - [x] createComment - 댓글 생성
    - [x] fetchComments - 게시글별 댓글 조회
      - profile 테이블 조인 (author 정보)
      - created_at 오름차순 정렬
    - [x] createComment - 댓글/대댓글 기능 작업
      - parentCommentId, rootCommentId 옵셔널 파라미터
    - [x] updateComment - 댓글 수정
    - [x] deleteComment - 댓글 삭제

  상태 관리 (TanStack Query)
  - [x] QUERY_KEYS 업데이트
  - [x] `use-comments-data.ts` query 훅 생성
  - [x] Mutation 훅 생성
    - [x] `use-create-comment.ts`
      - onSuccess: 캐시에 새 댓글 추가
      - profile 정보 가져와서 author 필드 채우기
    - [x] `use-update-comment.ts`
      - onSuccess: 캐시에서 해당 댓글 content 업데이트
    - [x] `use-delete-comment.ts`
      - onSuccess: 캐시에서 해당 댓글 제거

  UI 컴포넌트 - CommentEditor
  - [x] `comment-editor.tsx` 컴포넌트 생성
    - [x] Props 타입 정의
    - [x] Textarea + 버튼 UI
    - [x] isPending 상태에 따른 비활성화
    - [x] 모드별 submit 로직 분기

  UI 컴포넌트 - CommentItem
  - [x] `comment-item.tsx` 컴포넌트 생성
    - [x] Props: NestedComment 타입
    - [x] 작성자 아바타 + 닉네임 표시
    - [x] 댓글 내용 표시
    - [x] 작성 시간 표시 (상대 시간)
    - [x] 수정/삭제 버튼 (본인 댓글만)
      - isMine 체크: session.user.id === author_id
    - [x] 답글 버튼 + 토글 상태
    - [x] 수정 모드 토글 → CommentEditor(EDIT) 렌더링
    - [x] 답글 모드 토글 → CommentEditor(REPLY) 렌더링
    - [x] 삭제 확인 다이얼로그 (AlertModal)
    - [x] 대댓글 멘션 표시 (@닉네임)
      - parent_comment_id !== root_comment_id인 경우
    - [x] 자식 댓글 재귀 렌더링
    - [x] 들여쓰기 스타일 (루트 vs 대댓글)

  UI 컴포넌트 - CommentList
  - [x] `comment-list.tsx` 컴포넌트 생성
    - [x] useCommentsData 훅 사용
    - [x] 로딩/에러 상태 처리
    - [x] toNestedComments 유틸 함수 구현
      - 평탄한 배열 → 계층 구조 변환
      - root_comment_id가 null인 댓글 = 루트
      - root_comment_id가 있는 댓글 = 해당 루트의 children에 추가
    - [x] CommentItem 목록 렌더링

  통합 및 마무리
  - [x] 게시글 상세 페이지에 댓글 섹션 통합
    - [x] CommentEditor(CREATE) 배치
    - [x] CommentList 배치
  - [x] RLS 정책 설정
  - [x] 테스트
    - [x] 댓글 CRUD 동작 확인
    - [x] 대댓글 생성/표시 확인
    - [x] 계층 구조 렌더링 확인 (무한 depth)
    - [x] 멘션(@) 표시 확인
    - [x] 캐시 업데이트 확인
    - [x] 권한 체크 (본인 댓글만 수정/삭제)

  > 📖 상세 가이드: [좋아요 시스템 설계](./feature/post-like.md)

- [x] **Milestone 10: 리팩토링 및 코드 품질 개선**
  - [x] 공통 컴포넌트 추출
    - [x] Dialog(Modal) 공통 컴포넌트화
      - [x] AlertModal
            적용할 페이지: comment-item.tsx, post-item.tsx,
    - [x] Loader / GlobalLoader 컴포넌트
    - [x] Fallback (에러 상태) 컴포넌트
    - [x] ModalProvider 정리
  - [x] 유틸리티 정리
    - [x] 시간 포맷 유틸리티 (lib/time.ts)
    - [x] Supabase 에러 메시지 매핑 (error-messages.ts)
    - [x] Sonner Toast 설정 통일
  - [x] Query Key 및 API 최적화
    - [x] 전체 코드 검토. 특히 provider (자원 낭비, 성능, 보안) AI 체크
  - [x] 컴포넌트 리팩토링 (최소 분리 원칙)
        각 페이지, 컴포넌트들을 확인해보면서 리팩토링이 필요한지 검토해보기

    > 📖 상세 가이드: [리펙토링 가이드](./guides/refactoring-guide.md)

    **auth/**
    - [x] sign-in-page.tsx
    - [x] sign-up-page.tsx
    - [x] forget-password-page.tsx
    - [x] reset-password-page.tsx
    - [x] profile-page.tsx
    - [x] profile-edit-page.tsx
    - [x] auth 최종 AI에게 중복되는 코드, 필요없는코드, 확인해봐야 하는 코드 등등을 찾아내라 하기.

    **family/**
    - [x] no-family-page.tsx
    - [x] create-family-page.tsx
    - [x] join-family-page.tsx
    - [x] family-invite-page.tsx
    - [x] family-setting-page.tsx ⚠️ (349줄, 분리 권장)

    **post/**
    - [x] post-feed.tsx
    - [x] post-item.tsx
    - [x] post-detail-page.tsx

    **comment/**
    - [x] comment-editor.tsx
    - [x] comment-list.tsx
    - [x] comment-item.tsx

    **root/**
    - [x] index-page.tsx

    **app/**
    - [x] app.tsx 및 providers

- [x] **Milestone 11: post관련 리팩토링 및 코드 품질 개선**

  Phase 1: DB 스키마 변경 (Supabase Dashboard)
  - posts 테이블
    - [x] `family_member_id` 컬럼 추가 (UUID, nullable 먼저)
    - [x] 기존 데이터 마이그레이션 (author_id + family_id로 family_member_id 매핑)
    - [x] `family_member_id` NOT NULL 제약 설정
    - [x] FK 제약조건 추가 (`family_member_id` → `family_members.id`, ON DELETE CASCADE)

  - [x] post_comments 테이블
    - [x] `family_member_id` 컬럼 추가
    - [x] 기존 데이터 마이그레이션
    - [x] NOT NULL 제약 및 FK 설정

  - [x] 타입 재생성
        `npm run type-gen` 실행

  Phase 2: API 수정
  - `src/api/post.ts`
    - [x] `fetchPosts`: FK 조인으로 변경 (`family_members!family_member_id`)
    - [x] `fetchPostById`: FK 조인으로 변경
    - [x] `createPost`: `familyMemberId` 파라미터 추가, INSERT 시 `family_member_id` 설정
    - [x] `createPostWithImages`: `familyMemberId` 파라미터 추가 및 전달

  - `src/api/comment.ts` (post_comments 변경 시)
    - [x] `fetchComments`: FK 조인으로 변경
    - [x] `createComment`: `familyMemberId` 파라미터 추가

  Phase 3: Hooks 및 호출부 수정
  - [x] `useCreatePost` 호출부에서 `familyMemberId` 전달
  - [x] `useCreateComment` 호출부에서 `familyMemberId` 전달 (해당 시)
  - [x] post 생성 UI에서 현재 활성 가족의 `family_members.id` 획득 및 전달

  Phase 4: 스토리지 처리: 멤버 탈퇴 시 posts CASCADE 삭제되지만, **스토리지 이미지는 별도 처리 필요**
  - [x] `family.ts`에서 이미지 삭제 코드 처리

  Phase 6: 테스트
  - [x] 게시글 생성 테스트
  - [x] 게시글 목록 조회 테스트 (FK 조인 확인)
  - [x] 게시글 상세 조회 테스트
  - [x] 게시글 수정/삭제 테스트
  - [x] "내 글" 표시 (isMine) 테스트
  - [x] **가족 탈퇴 시 해당 멤버의 게시글 CASCADE 삭제 테스트**
  - [x] **가족 탈퇴 시 해당 멤버의 댓글 CASCADE 삭제 테스트**
  - [x] **가족 탈퇴 시 해당 멤버의 sotrage(이미지) 삭제 테스트**

- [x] **Milestone12: UI/UX 디자인 최종화**
  - [x] UX 수정 작업
    - [x] 프로필 이미지 변경 시 post에서 안보임: 캐싱 수정하기 invalidate
    - [x] 가족 만들때 하단에 개인정보 입력하게
    - [ ] ~~가족 생성/가입 시 바로 list가 안보이고 공백화면 -> 가족 생성/가입 페이지 깜빡임 -> list 보임~~
    - [ ] ~~가족이 하나이면 posts페이지 상단에 안뜨게~~
  - [x] 와이어프레임에서 최종 디자인으로 전환
  - [x] 메뉴 active 처리
  - [x] 다크모드
  - [x] 로고 생성 및 변경

- [x] **Milestone13: 추가 기능**
  - [x] 소셜로그인

- [x] **Milestone14: 배포**
  - [x] 메타태그 및 OG 이미지 설정 (index.html)
  - [x] Vercel 배포 및 환경변수 설정 (Production/Development)
  - [x] Supabase 리다이렉트 URL 및 세팅

- [x] **Milestone14: 수정사항**
  - [x] 모바일 초대페이지 상단 여백 확인
  - [x] 초대 및 가입페이지 상단으로 올리기 수정

## 🧩 Backlog

- [ ] **Milestone: 문서화 작업**
  - [ ] README.md 프로젝트 문서화

- [ ] **Milestone: Nice To Have**
  - [ ] 알림기능
  - [ ] 히어로 페이지(소개 페이지) 만들기 https://brunch.co.kr/@jisungmin/31
  - [ ] 구글 애널리틱스
  - [ ] 이용약관, 개인정보처리방침
  - [ ] 알림 기능
  - [ ] 채팅 기능

- [ ] **Milestone: 신규 페이지**
  - [ ] 캘린더 페이지 calendar-page.tsx
  - [ ] 갤러리 페이지 gallery-page.tsx
  - [ ] 가족 관계도 페이지 family-tree-page.tsx

- [ ] **Milestone: 기술적 개선**
  - [ ] Lighthouse 점수 체크 및 개선

---

## 🔄 운영 원칙

### 1. 커밋 컨벤션(Commit Convention)

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정 (README 등)
- `style`: 코드 의미에 영향을 주지 않는 변경사항 (포맷팅, 세미콜론 누락 등)
- `refactor`: 코드 리팩토링
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등

### 2. 원자적 커밋 (Atomic Commits)

하나의 커밋에는 **딱 한 가지 변화**만 담는다. "로그인 기능 구현 및 배경색 변경"처럼 두 가지 일을 최대한 섞지 않는다. 나중에 에러가 났을 때 특정 시점으로 되돌리기 훨씬 쉬움.

예시:

- `chore: Vite + React + TS 초기화`
- `chore: Tailwind / ESLint / Prettier 설정`
- `feat: design login page UI`

### 3. README.md를 살아있는 문서로 만들기

프로젝트 중간중간 README를 업데이트하세요.

- **초반:** 기획 의도, 기술 스택 선택 이유
- **중반:** 직면했던 기술적 문제와 해결 과정 (Troubleshooting)
- **후반:** 프로젝트 실행 방법 및 시연 GIF

### 4. 디자인 전략 (Design Strategy)

#### 개발 단계 (MVP 완성 전)

- **와이어프레임 스타일 유지**: 컴포넌트의 명확한 구분을 위해 `border` 속성 사용
- 기능 구현에 집중하며, 명확한 레이아웃 구조 확립
- 예시: `className="border border-gray-300 p-4"` 같은 직각적인 느낌

#### 최종 단계 (기능 완성 후)

- 모든 기능 구현 완료 후 디자인 시스템 최종 수정
- 부드러운 UI/UX로 전환 (border-radius, shadow, transition 등)
- 브랜드 컬러 및 일관된 디자인 언어 적용
