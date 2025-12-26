# Project Plan & Task Tracker

## 🎯 목표

1차 버전: 커뮤니티 핵심 기능 MVP 완성  
출시 목표일: 2025-12-15  
핵심지표: 회원가입 + 글작성 + 댓글 + AI요약

---

## 📆 개발 타임라인

| Phase   | 기간          | 주요 목표                                |
| ------- | ------------- | ---------------------------------------- |
| Phase 1 | 12/24 ~ 12/24 | 프로젝트 환경 세팅 (~ Milestone 2)       |
| Phase 2 | 12/26 ~ 12/26 | 기초 디자인 및 프로젝트 페이지 설계      |
| Phase 3 | / ~ /         | 가족 그룹 시스템 (Core), 수파베이스 연동 |
| Phase 4 | / ~ /         | 피드 (Private SNS)                       |
| Phase   | / ~ /         | 블로그형 카테고리 게시판                 |
| Phase   | / ~ /         | 가족 공유 캘린더                         |
| Phase   | / ~ /         | README 수정 및 배포                      |
| Phase   | / ~ /         | 가족 관계도(Interactive Family Tree)     |

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

- [ ] **Milestone 3: 앱 구조 및 라우팅 세팅**
  - [x] 프로젝트 기본 구조 설계(MVP 수준)
  - [ ] RootRoute 컴포넌트라우트 구조 설계(MVP 수준)
  - [ ] 기본 페이지 컴포넌트 세팅 (ex: pages/index-page.tsx, pages/sign-in-page)
  - [ ] GlobalLayout 컴포넌트 구현 (Header, Main, Footer)
  - [ ] GuestOnlyLayout / MemberOnlyLayout 보호 라우트 구현

- [ ] **Milestone 4: Supabase 연동**
  - [ ] Supabase 프로젝트 생성 및 환경변수 설정
  - [ ] Supabase Client 초기화 (lib/supabase.ts)
  - [ ] 타입 자동 생성 스크립트 설정 (npm run type-gen)

- [ ] **Milestone 5: Auth(인증 시스템 구축)**
  - [ ] 로그인 / 회원가입 폼
  - [ ] 기본 테이블 스키마 설계 (profile, post 등) ⬅️ 추가
  - [ ] SessionProvider(Zustand) 컴포넌트 구현
  - [ ] 비밀번호 재설정 기능

- [ ] **Milestone 6: CRUD 작업(커뮤니티 & 게시글)**
  - [ ] 게시글 CRUD
  - [ ] 게시글 정렬 / 검색
  - [ ] Pagination 추가
  - [ ] Query Key Factory 패턴 구성
  - [ ] 캐시 최적화 작업(id[]에서 독립적인 id로 캐시관리)
    - 📝 직접 구현해보고 블로그로 기록하기

## 🧩 Backlog (추후 진행 예정)

- [ ] **Milestone: 공통 컴포넌트 및 유틸리티**
  - [ ] Loader / GlobalLoader / Fallback 컴포넌트 구현
  - [ ] Fallback (에러 상태) 컴포넌트 구현
  - [ ] Sonner Toast 알림 설정
  - [ ] ModalProvider 및 Portal 설정
  - [ ] 시간 포맷 유틸리티 구현 (lib/time.ts)
        Supabase 에러 메시지 매핑 유틸리티 (error-messages.ts)

- [ ] **Milestone: 배포**
  - [ ] 구글 애널리틱스 설정
  - [ ] README.md 프로젝트 문서화
  - [ ] 메타태그 및 OG 이미지 설정 (index.html)
  - [ ] Vercel 배포 및 환경변수 설정 (Production/Development)

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

---
