# 🏡 Okuri

가족을 위한 프라이빗 커뮤니케이션 플랫폼

> 상태: **MVP 1차 완료 + 배포 완료** (추가 기능 및 문서 고도화 진행 중)

## 📌 프로젝트 소개

**Okuri(OK + 우리)**는 SNS 피로도가 높은 사용자가 불특정 다수가 아닌,  
이미 신뢰가 형성된 소규모 관계(가족) 안에서 일상과 감정을 안전하게 공유하도록 만든  
**폐쇄형 커뮤니케이션 서비스**입니다.

- 공개 SNS 대신, 가족 중심의 private 공간
- 관계 기반 권한 모델 + Supabase RLS 정책
- 일상 공유를 빠르게 끝내는 모바일 중심 UX

비전 원문은 [docs/VISION.md](./docs/VISION.md)에서 확인할 수 있습니다.

## ✨ 현재 구현된 기능 (MVP)

`docs/TASKS.md` 기준 Milestone 1~14 완료 항목을 반영했습니다.

### 1) 인증 / 계정

- 이메일 회원가입, 로그인, 로그아웃
- 비밀번호 재설정(이메일)
- 소셜 로그인
- 세션 기반 보호 라우팅(GuestOnly / MemberOnly)

### 2) 가족 그룹 시스템 (Core)

- 가족 생성 / 초대코드 가입
- 가족 전환 및 현재 가족 상태 관리
- 가족 멤버 관리(권한 부여, 내보내기, 탈퇴, 관리자 기능)
- 가족 프로필 및 아바타 관리

### 3) 게시글 시스템

- 게시글 CRUD
- 이미지 업로드(다중)
- 카테고리 기반 피드(전체/일반/공지)
- 무한 스크롤 + 캐시 최적화

### 4) 상호작용

- 게시글 좋아요(낙관적 업데이트 포함)
- 댓글 / 대댓글(계층형)
- 댓글 수정/삭제 및 권한 검증

### 5) 품질 / 보안 / 배포

- 리팩토링 및 공통 컴포넌트 정리
- Supabase RLS 정책(테이블/스토리지) 적용
- UI/UX 최종화(다크모드 포함)
- Vercel 배포 및 메타/OG 설정

## 🛠️ 기술 스택

| 영역       | 스택                              |
| ---------- | --------------------------------- |
| Frontend   | React 19, TypeScript, Vite        |
| Styling/UI | Tailwind CSS, shadcn/ui           |
| State      | Zustand, TanStack Query           |
| Backend    | Supabase(Auth, Postgres, Storage) |
| Deployment | Vercel                            |

## 🗺️ 로드맵 (Backlog)

`docs/TASKS.md`의 미완료 항목 기준:

- 문서화 보강(README 포함)
- 알림 기능, 채팅 기능
- 히어로(소개) 페이지
- Google Analytics
- 이용약관 / 개인정보처리방침
- 캘린더 / 갤러리 / 가족관계도 페이지
- Lighthouse 점수 개선

## 📚 문서

- 비전: [docs/VISION.md](./docs/VISION.md)
- 태스크/진행 현황: [docs/TASKS.md](./docs/TASKS.md)
- 기능 상세: [docs/feature](./docs/feature)
- 가이드: [docs/guides](./docs/guides)

## 👤 Author

**denizmatsuri** · Portfolio Project

## 📄 License

This project is licensed under the MIT License.
