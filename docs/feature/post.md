# Feature: Post System

## Status

- 상태: 구현 완료
- 최종 수정: 2026-01-21
- 관련 코드: `src/types.ts`, `src/pages/`, `src/api/post.ts`, `src/hooks/`

---

## Goal

- 가족 구성원들이 **일상을 공유**할 수 있는 게시글 기능
- 모든 게시글은 **특정 가족 그룹 범위 내에서만** 조회/공유됨
- 텍스트와 이미지를 함께 업로드 가능

---

## UI Flow

### A. 게시글 목록 조회

1. `/` (IndexPage) 진입
2. 현재 선택된 가족의 게시글 목록 표시
3. 무한 스크롤(useInfiniteQuery)으로 추가 로드

### B. 게시글 작성

1. 글쓰기 버튼 클릭
2. 내용 입력 + 이미지 첨부 (선택)
3. 작성 완료 → 목록에 즉시 반영

### C. 게시글 수정/삭제

1. 본인 게시글에서 수정/삭제 버튼 표시
2. 수정: 내용/이미지 변경 후 저장
3. 삭제: 확인 모달 → 삭제 완료

---

## Routes

- `/` → `index-page.tsx`
  - 게시글 목록 (피드)
- `/post/:postId` → `post-detail-page.tsx` (선택)
  - 게시글 상세 보기

---

## DB

### ERD

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    families     │     │      posts      │     │      users      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ family_id (FK)  │     │ id (PK)         │
│ name            │     │ id (PK)         │────►│ email           │
│ ...             │     │ author_id (FK)  │     │ display_name    │
└─────────────────┘     │ content         │     │ ...             │
                        │ image_urls      │     └─────────────────┘
                        │ created_at      │
                        │ is_notice       │
                        │ like_count      │
                        └─────────────────┘
```

---

### 테이블 정의

```sql
-- =============================================
-- posts 테이블 생성
-- =============================================

CREATE TABLE public.posts (
  id bigint primary key generated always as identity,
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  image_urls text[],
  is_notice boolean DEFAULT false,
  like_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
);

-- 📌 추후 성능 이슈 발생 시:
-- 인덱스 생성 (가족별 최신순 조회 최적화)
-- CREATE INDEX idx_posts_family_id_created_at ON public.posts(family_id, created_at DESC);
```

---

### 테이블 요약

| 테이블  | 역할                     | 핵심 필드                                         |
| ------- | ------------------------ | ------------------------------------------------- |
| `posts` | 가족 그룹 내 게시글 저장 | family_id, author_id, content, image_urls, notice |

---

### 필드 설명

| 필드         | 타입        | 설명                         |
| ------------ | ----------- | ---------------------------- |
| `id`         | number      | 게시글 고유 ID               |
| `family_id`  | uuid (FK)   | 소속 가족 그룹 (families.id) |
| `author_id`  | uuid (FK)   | 작성자 (users.id)            |
| `content`    | text        | 게시글 내용                  |
| `image_urls` | text[]      | 첨부 이미지 URL 배열         |
| `is_notice`  | boolean     | 공지사항                     |
| `created_at` | timestamptz | 작성일시                     |

---

### RLS (Row Level Security)

```sql
-- =============================================
-- posts 테이블 정책
-- =============================================

-- ✅ 같은 가족 멤버만 게시글 조회 가능
CREATE POLICY "posts_select_family_member"
ON public.posts FOR SELECT TO authenticated
USING (public.is_family_member(family_id));

-- ✅ 가족 멤버만 게시글 작성 가능 (본인만 작성자가 될 수 있음)
CREATE POLICY "posts_insert_family_member"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (
  public.is_family_member(family_id)
  AND author_id = auth.uid()
);

-- ✅ 본인 게시글만 수정 가능
CREATE POLICY "posts_update_own"
ON public.posts FOR UPDATE TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- ✅ 본인 게시글 삭제 가능
CREATE POLICY "posts_delete_own"
ON public.posts FOR DELETE TO authenticated
USING (author_id = auth.uid());

-- Admin은 가족 내 모든 게시글 삭제 가능
-- CREATE POLICY "posts_delete_admin"
-- ON public.posts FOR DELETE TO authenticated
-- USING (public.is_family_admin(family_id));
```

---

## TypeScript 타입 (예상)

```typescript
// src/types.ts에 추가 예정

// Entity 타입
export type PostEntity = Database["public"]["Tables"]["posts"]["Row"];

// 확장 타입 (작성자 정보 포함)
export type Post = PostEntity & {
  familyMember: FamilyMember;
};
```

---

## 참고사항

### 이미지 저장

- Storage bucket: `post-images`
- 경로: `families/{familyId}/posts/{userId}/{postId}/{fileName}`

```
경로: families/{familyId}/posts/{userId}/{postId}/{fileName}
- [1] = families
- [2] = {familyId}
- [3] = posts
- [4] = {userId} (작성자)
- [5] = {postId}
```

- 이미지 URL은 posts.image_urls 배열에 저장

### Storage RLS Policy

게시글 이미지 저장소(`families/{familyId}/posts/...`)에 대한 접근 정책:

```sql
-- =============================================
-- posts 이미지 Storage Policy
-- =============================================

-- ✅ SELECT (읽기): 가족 멤버만 해당 가족의 게시글 이미지 조회 가능
CREATE POLICY "Family members can view post images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'families'
  AND (storage.foldername(name))[3] = 'posts'
  AND is_family_member((storage.foldername(name))[2]::uuid)
);

-- ✅ INSERT (업로드): 가족 멤버만 본인 폴더에 업로드 가능
CREATE POLICY "Family members can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'families'
  AND (storage.foldername(name))[3] = 'posts'
  AND (storage.foldername(name))[4] = auth.uid()::text
  AND is_family_member((storage.foldername(name))[2]::uuid)
);

-- UPDATE (수정): 본인이 업로드한 이미지만 수정 가능
CREATE POLICY "Users can update own post images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'families'
  AND (storage.foldername(name))[3] = 'posts'
  AND (storage.foldername(name))[4] = auth.uid()::text
  AND is_family_member((storage.foldername(name))[2]::uuid)
)
WITH CHECK (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'families'
  AND (storage.foldername(name))[3] = 'posts'
  AND (storage.foldername(name))[4] = auth.uid()::text
  AND is_family_member((storage.foldername(name))[2]::uuid)
);

-- DELETE (삭제): 본인 또는 가족 관리자만 삭제 가능
CREATE POLICY "Users or admins can delete post images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'okuri-storage'
  AND (storage.foldername(name))[1] = 'families'
  AND (storage.foldername(name))[3] = 'posts'
  AND is_family_member((storage.foldername(name))[2]::uuid)
  AND (
    (storage.foldername(name))[4] = auth.uid()::text
    OR is_family_admin((storage.foldername(name))[2]::uuid)
  )
);
```

| 동작   | 권한             | 조건                                            |
| ------ | ---------------- | ----------------------------------------------- |
| SELECT | 가족 멤버        | 해당 가족의 게시글 이미지만 조회                |
| INSERT | 가족 멤버        | 본인 폴더(`{userId}`)에만 업로드                |
| UPDATE | 작성자 본인      | 본인이 올린 이미지만 수정                       |
| DELETE | 작성자 or 관리자 | 본인 이미지 또는 관리자는 모든 이미지 삭제 가능 |

> **경로 구조**: `families/[1]/{familyId}[2]/posts[3]/{userId}[4]/{postId}[5]/{fileName}`

### CASCADE 삭제

- 가족 삭제 시 → 해당 가족의 모든 게시글 자동 삭제
- 사용자 삭제 시 → 해당 사용자의 모든 게시글 자동 삭제

### updated_at 트리거

기존 `update_updated_at_column` 함수가 없다면 아래 추가 필요:

```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
