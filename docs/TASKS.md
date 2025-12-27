# Project Plan & Task Tracker

## 🎯 목표

1차 버전: 커뮤니티 핵심 기능 MVP 완성  
출시 목표일: 2025-12-15  
핵심지표: 회원가입 + 글작성 + 댓글 + AI요약

---

## 📆 개발 타임라인

| Phase   | 기간          | 주요 목표                            |
| ------- | ------------- | ------------------------------------ |
| Phase 1 | 12/24 ~ 12/24 | 프로젝트 환경 세팅 (~ Milestone 2)   |
| Phase 2 | 12/26 ~ 12/26 | 기초 디자인 및 프로젝트 페이지 설계  |
| Phase 2 | 12/26 ~ 12/27 | 앱 구조 및 라우팅 세팅               |
| Phase 3 | 12/ ~ /       | 수파베이스 연동, Auth(Email)         |
| Phase 3 | 12/ ~ /       | 가족 그룹 시스템 (Core)              |
| Phase 4 | / ~ /         | 피드 (Private SNS)                   |
| Phase   | / ~ /         | 블로그형 카테고리 게시판             |
| Phase   | / ~ /         | 가족 공유 캘린더                     |
| Phase   | / ~ /         | README 수정 및 배포                  |
| Phase   | / ~ /         | 가족 관계도(Interactive Family Tree) |

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

- [ ] **Milestone 4: Supabase 연동**
  - [ ] Supabase 프로젝트 생성 및 환경변수 설정
  - [ ] Supabase Client 초기화 (lib/supabase.ts)
  - [ ] 타입 자동 생성 스크립트 설정 (npm run type-gen)

- [ ] **Milestone 5: Auth(인증 시스템 구축)**
  - [ ] Supabase Auth 설정 및 환경변수 구성
  - [ ] 로그인 / 회원가입 폼
  - [ ] SessionProvider(Zustand) 구현
  - [ ] 비밀번호 재설정 기능
  - [ ] 기본 profile 테이블 설계 및 생성, 가족 그룹 시스템읠 염두해두고 작업

- [ ] **Milestone 6: 가족 그룹 시스템 (Core)**
  - [ ] 가족 그룹 DB 스키마 설계
    - family 테이블 (그룹 정보)
    - family_member 테이블 (구성원-역할 매핑)
  - [ ] 가족 그룹 생성 기능
  - [ ] 가족 구성원 초대 시스템 (초대 코드 or 링크)
  - [ ] 가족 구성원 목록 조회
  - [ ] 그룹 전환 UI (여러 가족 그룹 소속 가능한 경우)
  - [ ] 권한 체크 미들웨어 (RLS 정책 or API 레벨)

- [ ] **Milestone 7: CRUD 작업(게시글)**
  - [ ] post 테이블 스키마 설계 (family_id 외래키 포함)
  - [ ] 게시글 CRUD
  - [ ] 게시글 목록 조회 (가족 그룹 필터링)
  - [ ] 카테고리 필터 (전체글/공지사항/펑)
  - [ ] ~~Pagination~~ Infinite scrolling 추가
  - [ ] Query Key Factory 패턴 구성
    - 캐시 최적화 작업(id[]에서 독립적인 id로 캐시관리)
    - 📝 직접 구현해보고 블로그로 기록하기

## 🧩 Backlog

- [ ] **Milestone: 공통 컴포넌트 및 유틸리티**
  - [ ] GuestOnlyLayout / MemberOnlyLayout 보호 라우트 구현
  - [ ] Loader / GlobalLoader / Fallback 컴포넌트 구현
  - [ ] Fallback (에러 상태) 컴포넌트 구현
  - [ ] Sonner Toast 알림 설정
  - [ ] ModalProvider 및 Portal 설정
  - [ ] 시간 포맷 유틸리티 구현 (lib/time.ts)
        Supabase 에러 메시지 매핑 유틸리티 (error-messages.ts)
  - [ ] Google 로그인

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

### 4. 디자인 전략 (Design Strategy)

#### 개발 단계 (MVP 완성 전)

- **와이어프레임 스타일 유지**: 컴포넌트의 명확한 구분을 위해 `border` 속성 사용
- 기능 구현에 집중하며, 명확한 레이아웃 구조 확립
- 예시: `className="border border-gray-300 p-4"` 같은 직각적인 느낌

#### 최종 단계 (기능 완성 후)

- 모든 기능 구현 완료 후 디자인 시스템 최종 수정
- 부드러운 UI/UX로 전환 (border-radius, shadow, transition 등)
- 브랜드 컬러 및 일관된 디자인 언어 적용
