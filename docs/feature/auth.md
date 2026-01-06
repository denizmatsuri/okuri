# Feature: Authentication System

## Status

- 상태: 구현 완료
- 최종 수정: 2026-01-06
- 관련 코드: `src/api/auth.ts`, `src/store/session.ts`, `src/pages/auth/`, `src/hooks/mutations/auth/`

---

## Goal

- 이메일/비밀번호 기반 회원가입 및 로그인
- Supabase Auth를 통한 인증 상태 관리
- 비밀번호 분실 시 이메일을 통한 재설정
- 로그인 여부에 따른 라우트 보호

---

## Architecture

### 핵심 흐름

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           회원가입 흐름                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   Client                    Supabase Auth              Database         │
│   ──────                    ─────────────              ────────         │
│      │                           │                         │            │
│      │ signUp(email, password)   │                         │            │
│      │─────────────────────────► │                         │            │
│      │                           │                         │            │
│      │                           │ INSERT INTO auth.users  │            │
│      │                           │────────────────────────►│            │
│      │                           │                         │            │
│      │                           │    ┌─────────────────────────────┐   │
│      │                           │    │ 🔄 TRIGGER: on_auth_user_   │   │
│      │                           │    │   created 실행              │   │
│      │                           │    │                             │   │
│      │                           │    │ → handle_new_user() 함수    │   │
│      │                           │    │ → public.users에 자동 생성  │   │
│      │                           │    │   (id, email만 저장)        │   │
│      │                           │    └─────────────────────────────┘   │
│      │                           │                         │            │
│      │◄────────── session ───────│                         │            │
│      │                           │                         │            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### DB Trigger

회원가입 시 `auth.users`에 사용자가 생성되면, **Supabase Trigger**가 자동으로 `public.users` 테이블에 최소 정보를 복사합니다.

```sql
-- supabase/migrations/20251230083953_create_user_trigger.sql

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

> ⚠️ **중요**: 이 트리거는 Supabase에서 실행되므로 클라이언트 코드에서는 `public.users` INSERT를 직접 호출하지 않습니다. 나머지 프로필 정보(birth_date, phone_number, avatar_url 등)는 온보딩 또는 프로필 수정 페이지에서 UPDATE합니다.

---

## UI Flow

### A. 회원가입

1. `/sign-up` 진입
2. 이메일, 비밀번호, 비밀번호 확인 입력
3. 비밀번호 일치 검증
4. `supabase.auth.signUp()` 호출
5. 성공 시 → 자동 로그인 (세션 발급) → `/` 리다이렉트

### B. 로그인

1. `/sign-in` 진입
2. 이메일, 비밀번호 입력
3. `supabase.auth.signInWithPassword()` 호출
4. 성공 시 → 세션 저장 → `/` 리다이렉트
5. 실패 시 → 에러 메시지 표시

### C. 로그아웃

1. 헤더 메뉴에서 로그아웃 클릭
2. `supabase.auth.signOut()` 호출
3. 서버 로그아웃 실패 시에도 `scope: "local"`로 로컬 세션 삭제
4. → `/sign-in` 리다이렉트

### D. 비밀번호 재설정

1. `/forget-password` 진입
2. 이메일 입력 → 재설정 링크 이메일 발송
3. 이메일 링크 클릭 → `/reset-password` 진입 (토큰 포함)
4. 새 비밀번호 입력 → `supabase.auth.updateUser()` 호출
5. 성공 시 → `/` 리다이렉트

---

## Routes

```
/sign-up          → SignUpPage (회원가입)
/sign-in          → SignInPage (로그인)
/forget-password  → ForgetPasswordPage (비밀번호 찾기)
/reset-password   → ResetPasswordPage (새 비밀번호 설정, 로그인 필요)
/profile/:userId  → ProfilePage (프로필 조회)
/profile/edit     → ProfileEditPage (프로필 수정)
```

### 라우트 보호

- `AuthLayout`: 비로그인 사용자 전용 (로그인 시 `/`로 리다이렉트)
- `MemberOnlyLayout`: 로그인 사용자 전용 (비로그인 시 `/sign-in`으로 리다이렉트)

---

## Session Management

### SessionProvider

앱 최상위에서 세션 상태를 관리합니다.

```typescript
// src/provider/session-provider.tsx

// 1. Supabase Auth 이벤트 구독
supabase.auth.onAuthStateChange((event, session) => {
  setSession(session); // Zustand store 업데이트
});

// 2. 프로필 프리페칭
useUserProfileData(session?.user.id);

// 3. 로딩 중이면 GlobalLoader 표시
if (!isSessionLoaded || isProfileLoading) {
  return <GlobalLoader />;
}
```

### Zustand Store

```typescript
// src/store/session.ts
type State = {
  isLoaded: boolean; // 초기 세션 로드 완료 여부
  session: Session | null;
};

// Hooks
useSession(); // 현재 세션 반환
useIsSessionLoaded(); // 세션 로드 완료 여부
useSetSession(); // 세션 업데이트 함수
```

---

## API Functions

```typescript
// src/api/auth.ts

signUp({ email, password }); // 회원가입
signInWithPassword({ email, password }); // 로그인
signOut(); // 로그아웃
sendResetPasswordEmail({ email }); // 비밀번호 재설정 이메일 발송
updatePassword({ password }); // 비밀번호 변경
```

---

## Types

```typescript
// Supabase에서 제공
import type { Session, User } from "@supabase/supabase-js";

// 프로필 (public.users)
export type UserEntity = Database["public"]["Tables"]["users"]["Row"];
```

---

## Error Cases

| 에러                   | 메시지                                     | 처리               |
| ---------------------- | ------------------------------------------ | ------------------ |
| 잘못된 이메일/비밀번호 | "이메일 또는 비밀번호가 올바르지 않습니다" | 입력 확인 안내     |
| 이미 등록된 이메일     | "이미 등록된 이메일입니다"                 | 로그인 페이지 안내 |
| 비밀번호 불일치 (클라) | "비밀번호가 일치하지 않습니다"             | 재입력 안내        |
| 세션 만료              | "세션이 만료되었습니다"                    | 재로그인 안내      |

---

## Implementation Checklist

- [x] Supabase Trigger (auth.users → public.users)
- [x] 회원가입 페이지 (`SignUpPage`)
- [x] 로그인 페이지 (`SignInPage`)
- [x] 비밀번호 찾기 페이지 (`ForgetPasswordPage`)
- [x] 비밀번호 재설정 페이지 (`ResetPasswordPage`)
- [x] 프로필 페이지 (`ProfilePage`, `ProfileEditPage`)
- [x] Session Provider
- [x] Session Store (Zustand)
- [x] Auth API 함수
- [x] Mutation 훅 (`use-sign-up`, `use-sign-in-with-password`, 등)
- [ ] 소셜 로그인 (Google, Kakao) - 미구현
- [ ] 이메일 인증 - 미구현
