# Feature: Family Group System

## Status

- 상태: 설계 확정 / DB 완료 / UI 구현 중
- 최종 수정: 2026-01-14
- 관련 코드: `src/types.ts`, `src/pages/family/`, `src/api/`, `src/hooks/`

---

## Goal

- 사용자가 **여러 가족 그룹**에 동시에 소속될 수 있다
- 각 가족 그룹에서 **다른 표시 이름과 역할**을 가질 수 있다 (예: "철수" vs "아빠")
- 모든 콘텐츠(게시글, 일정, 갤러리)는 특정 가족 그룹 범위 내에서만 공유된다

---

## UI Flow

### A. 첫 진입 (가족 없음)

1. 로그인 → `/` (IndexPage)
2. 가족 0개 → `/no-family` 리다이렉트
3. "새 가족 만들기" 또는 "초대 코드로 가입" 선택

### B. 가족 생성

1. `/family/create` 진입
2. Step 1: 가족 이름/설명 입력
3. Step 2: 내 프로필(표시명/역할) 설정
4. 생성 완료 → 초대 코드 표시 → `/family/:familyId`

### C. 초대 코드로 가입

1. `/family/join` 진입
2. 6자리 초대 코드 입력
3. 가족 정보 확인 + 내 프로필 설정
4. 가입 완료 → `/family/:familyId`

### D. 가족 전환 (다중 가족)

1. 헤더 드롭다운에서 가족 선택
2. 현재 가족 컨텍스트 변경 (Zustand)
3. 해당 가족의 `family_members` 프로필로 표시

### E. 멤버 초대 (관리자)

1. `/family/:familyId/invite` 진입
2. 초대 코드 복사 / 카카오톡 공유 / QR코드
3. 새 코드 생성 시 기존 코드 무효화

---

## Routes

### 온보딩

- `/no-family` → `no-family-page.tsx`
  - 가족이 없는 사용자의 시작점

### 가족 생성/가입

- `/family/create` → `create-family-page.tsx`
  - Step 1: 가족 정보 입력, Step 2: 내 프로필 설정
- `/family/join` → `join-family-page.tsx`
  - 초대 코드 입력 → 가족 정보 확인 → 프로필 설정

### 가족 관리

- `/family/:familyId/setting` → `family-setting-page.tsx`
- `/family/:familyId/invite` → `family-invite-page.tsx`

---

## DB

### ERD

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   auth.users    │     │     users       │     │    families     │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ id (PK, FK)     │     │ id (PK)         │
│ email           │     │ email           │     │ name            │
│ ...             │     │ birth_date      │     │ description     │
└─────────────────┘     │ phone_number    │     │ invite_code     │
                        │ avatar_url      │     │ invite_code_    │
                        │ display_name    │     │ expires_at      │
                        │ notification    │     │ created_at      │
                        │ created_at      │     │ updated_at      │
                        └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 └───────────┬───────────┘
                                             │
                                             ▼
                                ┌─────────────────────┐
                                │   family_members    │
                                ├─────────────────────┤
                                │ id (PK)             │
                                │ family_id (FK)      │
                                │ user_id (FK)        │
                                │ display_name        │
                                │ family_role         │
                                │ avatar_url          │
                                │ is_admin            │
                                │ joined_at           │
                                │ UNIQUE(family_id,   │
                                │        user_id)     │
                                └─────────────────────┘
```

---

### 테이블 요약

| 테이블           | 역할                       | 핵심 필드                           |
| ---------------- | -------------------------- | ----------------------------------- |
| `users`          | 계정 정보 (auth.users 1:1) | email, birth_date, avatar_url       |
| `families`       | 가족 그룹                  | name, invite_code                   |
| `family_members` | 가족별 프로필 (다대다)     | display_name, family_role, is_admin |

---

### RLS(Row Level Security)

### 헬퍼 함수

```sql
-- =============================================
-- 헬퍼 함수 (SECURITY DEFINER로 RLS 우회)
-- =============================================

-- ✅ 특정 가족의 멤버인지 확인
CREATE OR REPLACE FUNCTION public.is_family_member(check_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members
    WHERE family_id = check_family_id
      AND user_id = auth.uid()
  );
$$;

-- ✅ 특정 가족의 Admin인지 확인
CREATE OR REPLACE FUNCTION public.is_family_admin(check_family_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members
    WHERE family_id = check_family_id
      AND user_id = auth.uid()
      AND is_admin = true
  );
$$;
```

### users 테이블 정책

```sql
-- =============================================
-- users 테이블 정책
-- =============================================

-- ✅ 모든 프로필 조회 가능
CREATE POLICY "users_select_all"
ON public.users FOR SELECT TO authenticated
USING (true);

-- ✅ 본인만 수정 가능
CREATE POLICY "users_update_own"
ON public.users FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- INSERT: 정책 없음 (트리거가 SECURITY DEFINER로 처리)
-- DELETE: 정책 없음 (auth.users CASCADE로 처리, 직접 삭제 차단)
```

### families 테이블 정책

```sql
-- =============================================
-- families 테이블 정책
-- =============================================

-- ✅ 자신이 속한 가족 조회
CREATE POLICY "families_select_member"
ON public.families FOR SELECT TO authenticated
USING (public.is_family_member(id));

-- ✅ 초대 코드로 가족 조회 (가입 전 정보 확인)
CREATE POLICY "families_select_by_invite_code"
ON public.families FOR SELECT TO authenticated
USING (invite_code IS NOT NULL);

-- ✅ 가족 생성
CREATE POLICY "families_insert"
ON public.families FOR INSERT TO authenticated
WITH CHECK (true);

-- ✅ Admin만 가족 정보 수정
CREATE POLICY "families_update_admin"
ON public.families FOR UPDATE TO authenticated
USING (public.is_family_admin(id))
WITH CHECK (public.is_family_admin(id));

-- ✅ Admin만 가족 삭제
CREATE POLICY "families_delete_admin"
ON public.families FOR DELETE TO authenticated
USING (public.is_family_admin(id));
```

### family_members 테이블 정책

```sql
-- =============================================
-- family_members 테이블 정책
-- =============================================

-- ✅ 본인 멤버십 조회
CREATE POLICY "family_members_select_own"
ON public.family_members FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- ✅ 같은 가족의 다른 멤버 조회
CREATE POLICY "family_members_select_same_family"
ON public.family_members FOR SELECT TO authenticated
USING (public.is_family_member(family_id));

-- ✅ 본인을 가족 멤버로 등록 (가족 생성 또는 가입)
CREATE POLICY "family_members_insert_self"
ON public.family_members FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ✅ 본인 프로필 수정
CREATE POLICY "family_members_update_own_profile"
ON public.family_members FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ✅ Admin이 다른 멤버 권한 수정
CREATE POLICY "family_members_update_admin_grant"
ON public.family_members FOR UPDATE TO authenticated
USING (public.is_family_admin(family_id) AND user_id != auth.uid())
WITH CHECK (public.is_family_admin(family_id));

-- ✅ 본인 탈퇴
CREATE POLICY "family_members_delete_self"
ON public.family_members FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- ✅ Admin이 다른 멤버 추방
CREATE POLICY "family_members_delete_admin"
ON public.family_members FOR DELETE TO authenticated
USING (public.is_family_admin(family_id) AND user_id != auth.uid());
```
