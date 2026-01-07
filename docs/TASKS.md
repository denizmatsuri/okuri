# Project Plan & Task Tracker

## 🎯 목표

1차 버전: 커뮤니티 핵심 기능 MVP 완성  
출시 목표일: 2025-12-15  
핵심지표: 회원가입 + 글작성 + 댓글 + AI요약

---

## 📆 개발 타임라인

| Phase   | 기간          | 주요 목표                               |
| ------- | ------------- | --------------------------------------- |
| Phase 1 | 12/24 ~ 12/24 | ✅ 프로젝트 환경 세팅 (~ Milestone 2)   |
| Phase 2 | 12/26 ~ 12/26 | ✅ 기초 디자인 및 프로젝트 페이지 설계  |
| Phase 3 | 12/26 ~ 12/27 | ✅ 앱 구조 및 라우팅 세팅               |
| Phase 4 | 12/29 ~ 12/30 | ✅ 수파베이스 연동, Auth(Email)         |
| Phase 5 | 01/02 ~ 01/02 | ✅ Auth(Email)                          |
| Phase 6 | 01/05 ~ 01/08 | 회원정보 수정 & 가족 그룹 시스템 (Core) |
| Phase   | / ~ /         | 피드 (Private SNS)                      |
| Phase   | / ~ /         | 블로그형 카테고리 게시판                |
| Phase   | / ~ /         | 가족 공유 캘린더                        |
| Phase   | / ~ /         | README 수정 및 배포                     |
| Phase   | / ~ /         | 가족 관계도(Interactive Family Tree)    |

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

- [ ] **Milestone 6: 가족 그룹 시스템 (Core)**
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
    - [x] 프로필 + 아바타 이미지 수정 기능
      - [x] `api/profile.ts`
  - [ ] 페이지 라우트 & 온보딩
    - [ ] 초기값 세팅: 가족관련 QUERY_KEYS 추가
    - [ ] 가족 페이지 라우트 구조 추가
    - [ ] no-family-page.tsx UI 구현
    - [ ] index-page 리다이렉트 로직 (가족 유무)
  - [ ] 가족 생성 (Page + API + Hook)
    - [ ] `create-family-page.tsx` UI 구현
    - [ ] `api/family.ts` - createFamily 함수
    - [ ] `use-create-family.ts` mutation 훅
    - [ ] 페이지에 훅 연동 및 테스트
  - [ ] 가족 홈 & 컨텍스트
    - [ ] `family-home-page.tsx` UI 구현
    - [ ] `store/family.ts` 현재 가족 상태
    - [ ] `use-my-families.ts` query 훅
    - [ ] 헤더 가족 전환 드롭다운
  - [ ] 초대 관리
    - [ ] `family-invite-page.tsx` UI 구현
    - [ ] 초대코드 복사/공유 기능
    - [ ] `use-regenerate-invite-code.ts` 초대코드 재생성 기능 추가
  - [ ] 가족 가입 (Page + API + Hook)
    - [ ] `join-family-page.tsx` UI 구현
    - [ ] `api/family.ts` - joinFamily, validateCode
    - [ ] `use-join-family.ts` mutation 훅
    - [ ] 페이지에 훅 연동 및 테스트
  - [ ] 설정 & 멤버 관리
    - [ ] family-settings-page.tsx UI
    - [ ] 내 가족 프로필 수정 기능
    - [ ] family-members-page.tsx UI
    - [ ] use-family-members.ts query 훅
  - [ ] 관리자 & 탈퇴 기능
    - [ ] 멤버 권한 변경 (관리자 지정/해제)
    - [ ] 멤버 내보내기 기능
    - [ ] 가족 나가기 + 확인 다이얼로그
    - [ ] 가족 삭제 (관리자) + 경고
    - [ ] 관리자 회원 탈퇴시 경고 (생성한 가족방 삭제됨)
  - [ ] 마무리
    - [ ] RLS (Row Level Security) 정책 추가, storage 포함
    - [ ] 에러 메시지 한글화
    - [ ] 통합 테스트 및 버그 수정

  > 📖 상세 가이드: [가족 그룹 시스템 설계](./feature/family-group.md)

- [ ] **Milestone 7: CRUD 작업(게시글)**
  - [ ] post 테이블 스키마 설계 (family_id 외래키 포함)
  - [ ] 게시글 CRUD
  - [ ] 이미지 사이즈 크기 지정 및 용량 조절
  - [ ] 게시글 목록 조회 (가족 그룹 필터링)
  - [ ] 카테고리 필터 (전체글/공지사항/펑)
  - [ ] ~~Pagination~~ Infinite scrolling 추가
  - [ ] Query Key Factory 패턴 구성
    - 캐시 최적화 작업(id[]에서 독립적인 id로 캐시관리)
    - 📝 직접 구현해보고 블로그로 기록하기

## 🧩 Backlog

- [ ] **Milestone: 공통 컴포넌트 및 유틸리티**
  - [ ] Loader / GlobalLoader / Fallback 컴포넌트 구현
  - [ ] Fallback (에러 상태) 컴포넌트 구현
  - [ ] Sonner Toast 알림 설정
  - [ ] ModalProvider 및 Portal 설정
  - [ ] 시간 포맷 유틸리티 구현 (lib/time.ts)
        Supabase 에러 메시지 매핑 유틸리티 (error-messages.ts)
  - [ ] Google 로그인
  - [ ] 프로필 아바타 이미지 미리보기

- [ ] **Milestone: UI/UX 디자인 최종화**
  - [ ] 개발 중 와이어프레임 스타일 가이드 적용
    - 모든 컴포넌트에 border 적용 (명확한 구분)
    - 직각적인 느낌 유지 (rounded-none or rounded-sm)
  - [ ] 최종 디자인 시스템 구축
    - 브랜드 컬러 팔레트 정의
    - Typography 시스템 정의
    - Spacing 시스템 일관성 체크
  - [ ] 와이어프레임에서 최종 디자인으로 전환
    - Border 스타일 개선
    - Shadow 및 Transition 추가
    - 반응형 디자인 미세 조정

- [ ] **Milestone: 배포**
  - [ ] 구글 애널리틱스 설정
  - [ ] 이용약관, 개인정보처리방침
  - [ ] README.md 프로젝트 문서화
  - [ ] 메타태그 및 OG 이미지 설정 (index.html)
  - [ ] Vercel 배포 및 환경변수 설정 (Production/Development)
  - [ ] Supabase 리다이렉트URL 같은 설정 설정

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

하나의 커밋에는 **딱 한 가지 변화**만 담으세요. "로그인 기능 구현 및 배경색 변경"처럼 두 가지 일을 섞지 마세요. 나중에 에러가 났을 때 특정 시점으로 되돌리기 훨씬 쉽습니다.

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
