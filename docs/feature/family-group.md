# Feature: Family Group System

## Status

- 상태: 설계 확정 / DB 완료 / UI 구현 중
- 최종 수정: 2026-01-05
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

```
/                           → IndexPage (리다이렉트 허브)
/no-family                  → NoFamilyPage (온보딩)
/family/create              → CreateFamilyPage
/family/join                → JoinFamilyPage
/family/:familyId           → FamilyHomePage (피드)
/family/:familyId/settings  → FamilySettingsPage
/family/:familyId/members   → FamilyMembersPage (관리자)
/family/:familyId/invite    → FamilyInvitePage
/family/:familyId/calendar  → CalendarPage
/family/:familyId/gallery   → GalleryPage
```

---

## API Spec

### 가족 생성

```
POST /families
Body: { name, description }
Response: { family, inviteCode }
→ 자동으로 family_members에 생성자를 admin으로 등록
```

### 초대 코드로 가입

```
POST /families/join
Body: { inviteCode, displayName, familyRole }
Response: { family, membership }
```

### 가족 목록 조회 (내가 속한)

```
GET /families
Response: { families: FamilyWithMembership[] }
```

### 초대 코드 재생성 (관리자)

```
POST /families/:familyId/invite-code/refresh
Response: { inviteCode, expiresAt }
```

### 멤버 관리 (관리자)

```
PATCH /families/:familyId/members/:memberId
Body: { isAdmin: boolean }

DELETE /families/:familyId/members/:memberId
→ 멤버 내보내기
```

### 가족 나가기

```
DELETE /families/:familyId/leave
→ 마지막 관리자는 나갈 수 없음
```

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
                        │ display_name    │     │   expires_at    │
                        │ notification    │     │ created_by (FK) │
                        │ created_at      │     │ created_at      │
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

### 테이블 요약

| 테이블           | 역할                       | 핵심 필드                           |
| ---------------- | -------------------------- | ----------------------------------- |
| `users`          | 계정 정보 (auth.users 1:1) | email, birth_date, avatar_url       |
| `families`       | 가족 그룹                  | name, invite_code, created_by       |
| `family_members` | 가족별 프로필 (다대다)     | display_name, family_role, is_admin |

---

## Types

> 타입 정의는 `src/types.ts` 참조  
> DB 타입은 `src/database.types.ts` (`npm run type-gen` 자동 생성)

주요 타입:

- `FamilyEntity` - 가족 그룹
- `FamilyMemberEntity` - 가족 멤버십
- `FamilyMember` - 멤버 + 유저 정보 조인
- `ActiveFamilyContext` - 현재 활성 가족 컨텍스트
- `DisplayProfile` - 프로필 표시용 헬퍼

---

## Error Cases

| 에러                    | 메시지                             | 처리                    |
| ----------------------- | ---------------------------------- | ----------------------- |
| 유효하지 않은 초대 코드 | "유효하지 않은 초대 코드입니다"    | 코드 재확인 안내        |
| 만료된 초대 코드        | "만료된 초대 코드입니다"           | 새 코드 요청 안내       |
| 이미 가입된 가족        | "이미 가입된 가족입니다"           | 해당 가족으로 이동 버튼 |
| 마지막 관리자 탈퇴 시도 | "마지막 관리자는 나갈 수 없습니다" | 관리자 위임 안내        |

---

## Test Scenarios

### 가족 생성

- [ ] 가족 생성 → `families` 레코드 생성 확인
- [ ] 생성자가 `family_members`에 `is_admin: true`로 등록
- [ ] 초대 코드 6자리 생성 확인

### 초대 코드 가입

- [ ] 유효한 코드 → 가입 성공, 가족 홈으로 이동
- [ ] 만료된 코드 → 에러 메시지
- [ ] 이미 가입된 가족 → 중복 가입 방지

### 가족 전환

- [ ] 2개 이상 가족 소속 시 드롭다운 표시
- [ ] 전환 시 프로필(display_name, avatar) 변경 확인
- [ ] 전환 시 피드/갤러리 내용 변경 확인

### 권한

- [ ] 관리자만 멤버 내보내기 가능
- [ ] 관리자만 초대 코드 재생성 가능
- [ ] 일반 멤버는 자신의 프로필만 수정 가능

---

## Implementation Checklist

- [x] DB 마이그레이션 (`users`, `families`, `family_members`)
- [x] TypeScript 타입 정의 (`src/types.ts`)
- [ ] API 함수 (`src/api/family.ts`)
- [ ] Query 훅 (`src/hooks/queries/use-family-data.ts`)
- [ ] Mutation 훅 (`src/hooks/mutations/family/`)
- [ ] 가족 스토어 (`src/store/family.ts`)
- [ ] NoFamilyPage
- [ ] CreateFamilyPage
- [ ] JoinFamilyPage
- [ ] FamilyHomePage
- [ ] FamilySettingsPage
- [ ] FamilyMembersPage (관리자)
- [ ] FamilyInvitePage
- [ ] 헤더 가족 전환 드롭다운
