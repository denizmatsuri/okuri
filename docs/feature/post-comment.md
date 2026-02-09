# Feature: Post Comment System

## Status

- 상태: 구현 완료
- 관련 코드: `src/pages/post/post-detail-page.tsx`, `src/components/comment/`, `src/api/comment.ts`, `src/hooks/mutations/comment/`, `src/hooks/queries/use-comments-data.ts`

---

## Goal

- 게시글 상세 페이지에서 댓글/답글로 대화 가능
- 같은 가족 멤버만 댓글 조회/작성 가능 (RLS)
- 댓글 작성자 본인만 수정/삭제 가능
- 댓글 목록은 생성 시각 오름차순으로 조회 후 트리 구조로 렌더링

---

## UI Flow

### A. 댓글 목록 조회

1. `/post/:postId` 진입
2. `useCommentsData(postId)`로 `post_comments` 조회
3. 평탄한 댓글 배열을 루트/답글 트리로 변환해 렌더링

### B. 댓글 작성

1. 상세 페이지 하단 입력창에 내용 입력
2. `familyMemberId`와 함께 `createComment` 호출
3. 성공 시 캐시에 즉시 append되어 목록에 반영

### C. 답글 작성

1. 댓글의 "답글" 버튼 클릭
2. `parent_comment_id`, `root_comment_id` 포함하여 `createComment` 호출
3. 루트 댓글 하위에 답글 표시

### D. 댓글 수정/삭제

1. 본인 댓글에서 메뉴(수정/삭제) 노출
2. 수정: `updateComment` 호출 후 캐시 내 해당 댓글 교체
3. 삭제: 확인 모달 후 `deleteComment` 호출, 캐시에서 제거

---

## DB

### 테이블 정의

```sql
-- =============================================
-- post_comments 테이블 생성
-- =============================================

create table post_comments (
  id bigint primary key generated always as identity,
  post_id bigint references posts(id) on delete cascade not null,
  author_id uuid references public.users(id) on delete cascade not null default auth.uid(),
  family_member_id uuid references family_members(id) on delete cascade not null,
  content text not null,
  root_comment_id bigint references post_comments(id) on delete cascade,    -- 최상위 루트 댓글
  parent_comment_id bigint references post_comments(id) on delete cascade,  -- 직접 부모 댓글
  created_at timestamptz default now() not null
);

-- 📌 추후 성능 이슈 발생 시:
-- 성능을 위한 인덱스
-- create index idx_post_comments_post_id on post_comments(post_id);
-- create index idx_post_comments_root_id on post_comments(root_comment_id);
```

### RLS (Row Level Security)

```sql
-- RLS 활성화
-- alter table post_comments enable row level security;

-- ✅ SELECT: 같은 가족 멤버만 조회 가능
create policy "post_comments_select_policy" on post_comments
  for select to authenticated
  using (
    exists (
      select 1 from posts p
      join family_members fm on fm.family_id = p.family_id
      where p.id = post_comments.post_id
        and fm.user_id = auth.uid()
    )
  );

-- ✅ INSERT: 같은 가족 멤버만 생성 가능 + 본인 author_id
create policy "post_comments_insert_policy" on post_comments
  for insert to authenticated
  with check (
    -- 본인 author_id로만 생성
    author_id = auth.uid()
    -- 해당 게시글의 가족 멤버인지 확인
    and exists (
      select 1 from posts p
      join family_members fm on fm.family_id = p.family_id
      where p.id = post_comments.post_id
        and fm.user_id = auth.uid()
    )
  );

-- ✅ UPDATE: 본인 댓글만 수정 가능
create policy "post_comments_update_policy" on post_comments
  for update to authenticated
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

-- ✅ DELETE: 본인 댓글만 삭제 가능
create policy "post_comments_delete_policy" on post_comments
  for delete to authenticated
  using (author_id = auth.uid());
```
