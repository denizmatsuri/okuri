# Feature: Post Like System

## Status

- 상태: 구현 완료
- 관련 코드: `src/components/post/like-post-button.tsx`, `src/hooks/mutations/post/use-toggle-post-like.ts`, `src/api/post.ts`

---

## Goal

- 게시글에 대해 좋아요/좋아요 취소를 토글
- 동시성 상황에서도 `post_likes`와 `posts.like_count` 정합성 유지
- 사용자 체감 반응성을 위해 낙관적 업데이트 적용

---

## UI Flow

### A. 좋아요 표시

1. 피드/상세에서 좋아요 버튼과 `like_count` 노출
2. 목록 조회 시 현재 사용자 기준 `isLiked`를 함께 계산

### B. 좋아요 토글

1. 좋아요 버튼 클릭
2. `onMutate`에서 `isLiked`, `like_count`를 즉시 낙관적 업데이트
3. RPC `toggle_post_like(p_post_id, p_user_id)` 호출
4. 성공 시 낙관적 상태 유지, 실패 시 이전 상태로 롤백

---

## DB

### 테이블 정의

```sql
-- =============================================
-- post_likes 테이블 생성
-- =============================================

CREATE TABLE post_likes (
  id bigint primary key generated always as identity,
  post_id bigint NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),

  -- 한 유저가 같은 게시글에 중복 좋아요 방지
  UNIQUE(post_id, user_id)
);

-- 📌 추후 성능 이슈 발생 시:
-- 성능을 위한 인덱스
-- CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
-- CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
```

### RPC

```sql
-- 원래 함수가 있다면 삭제
-- DROP FUNCTION IF EXISTS toggle_post_like(bigint, uuid);

-- RPC로 호출할, 새로운 함수 생성
CREATE OR REPLACE FUNCTION toggle_post_like(p_post_id BIGINT, p_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
BEGIN
  -- 포스트 존재 확인 & 행 잠금
  IF NOT EXISTS (
    SELECT 1 FROM posts
    WHERE id = p_post_id
    FOR UPDATE
  ) THEN
    RAISE EXCEPTION '존재하지 않는 게시글입니다' USING ERRCODE = 'P0001';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM "post_likes"
    WHERE post_id = p_post_id AND user_id = p_user_id
  ) THEN
    -- 좋아요 기록 추가
    INSERT INTO "post_likes" (post_id, user_id)
    VALUES (p_post_id, p_user_id);

    -- 좋아요 카운트 증가
    UPDATE posts
    SET like_count = like_count + 1
    WHERE id = p_post_id;

    -- TRUE 반환
    RETURN TRUE;
  ELSE
    -- 좋아요 기록 삭제
    DELETE FROM "post_likes"
    WHERE post_id = p_post_id AND user_id = p_user_id;

    -- 좋아요 카운트 감소
    UPDATE posts
    SET like_count = like_count - 1
    WHERE id = p_post_id;

    -- FALSE 반환
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### RLS (Row Level Security)

```sql
-- RLS 활성화
-- ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- ✅ 1. SELECT: 인증 유저면 OK (굳이 같은 가족테이블을 조인해서 검색할 필요는 없을듯)
CREATE POLICY "Authenticated users can view likes"
ON post_likes FOR SELECT
USING (auth.uid() IS NOT NULL);

-- ✅ 2. INSERT: 본인만 좋아요 추가 가능
CREATE POLICY "Users can insert own likes"
ON post_likes FOR INSERT
WITH CHECK (user_id = auth.uid());

-- ✅ 3. DELETE: 본인만 좋아요 삭제 가능
CREATE POLICY "Users can delete own likes"
ON post_likes FOR DELETE
USING (user_id = auth.uid());
```
