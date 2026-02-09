# Post 무한스크롤 & 캐시 정규화

> useInfiniteQuery + Cursor 기반 페이지네이션 + 캐시 정규화 패턴 정리

---

## 1. Offset vs Cursor 페이지네이션 비교

### Offset 기반 (기존 방식)

```typescript
// Offset 기반
.range(from, to)  // 예: .range(0, 9), .range(10, 19)

// 또는 SQL로 표현하면
SELECT * FROM posts ORDER BY created_at DESC LIMIT 10 OFFSET 20
```

**동작 방식:**
```
페이지 1: OFFSET 0,  LIMIT 10 → 1~10번째 행
페이지 2: OFFSET 10, LIMIT 10 → 11~20번째 행
페이지 3: OFFSET 20, LIMIT 10 → 21~30번째 행
```

**문제점:**
```
[시나리오] 사용자가 1페이지를 보는 동안 새 글 2개가 추가됨

초기 상태: [A, B, C, D, E, F, G, H, I, J, ...]
1페이지 로드: [A, B, C, D, E] (OFFSET 0)

-- 새 글 X, Y 추가 --
현재 DB: [X, Y, A, B, C, D, E, F, G, H, I, J, ...]

2페이지 로드: [D, E, F, G, H] (OFFSET 5)
              ↑ ↑
              중복! D, E가 또 나옴
```

---

### Cursor 기반 (현재 방식)

```typescript
// Cursor 기반
.lt("id", cursor)  // "id가 cursor보다 작은 것만"
.limit(10)

// SQL로 표현하면
SELECT * FROM posts WHERE id < 100 ORDER BY created_at DESC LIMIT 10
```

> 참고: 실제 구현 쿼리는 `post_likes`/`family_members`/`users`를 함께 조회하고, `post_likes.user_id = 현재 userId` 조건으로 `isLiked`를 계산합니다.

**동작 방식:**
```
페이지 1: cursor 없음 → 가장 최신 10개 (id: 100~91)
페이지 2: cursor=91  → id < 91인 것 중 10개 (id: 90~81)
페이지 3: cursor=81  → id < 81인 것 중 10개 (id: 80~71)
```

**새 글 추가 시:**
```
[시나리오] 사용자가 1페이지를 보는 동안 새 글 추가됨

초기 상태: [100, 99, 98, 97, 96, ...]
1페이지 로드: [100, 99, 98, 97, 96, 95, 94, 93, 92, 91]
             마지막 id = 91 → nextCursor = 91

-- 새 글 101, 102 추가 --
현재 DB: [102, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, ...]

2페이지 로드: WHERE id < 91 → [90, 89, 88, 87, 86, 85, 84, 83, 82, 81]
             ✅ 중복 없음! 정확히 다음 데이터만 가져옴
```

---

## 2. 코드 상세 분석

### `fetchPosts` - API 레이어

```typescript
export async function fetchPosts({
  userId,       // 👈 현재 로그인 사용자 ID (좋아요 상태 계산용)
  familyId,
  category,
  cursor,      // 👈 마지막으로 본 post의 id
  limit = PAGE_SIZE,
}: { ... }) {
  
  let query = supabase
    .from("posts")
    .select(
      `
      *,
      myLiked: post_likes!post_id (*),
      familyMember: family_members!family_member_id (
        *,
        user: users (*)
      )
    `,
    )
    .eq("family_id", familyId)
    .eq("post_likes.user_id", userId)          // 👈 내 좋아요 여부 계산용
    .order("created_at", { ascending: false })  // 👈 최신순 정렬
    .limit(limit);                               // 👈 10개씩

  // 카테고리 필터
  if (category === "notice") {
    query = query.eq("is_notice", true);
  } else if (category === "general") {
    query = query.eq("is_notice", false);
  }

  // 👇 핵심: Cursor 기반 페이지네이션
  if (cursor) {
    query = query.lt("id", cursor);  // id가 cursor보다 작은 것만
  }
  // cursor가 없으면 (첫 페이지) 그냥 최신 10개

  const { data: posts, error } = await query;
  if (error) throw error;
  if (!posts?.length) return [];

  return posts.map((post) => ({
    ...post,
    isLiked: post.myLiked && post.myLiked.length > 0,
  }));
}
```

**`.lt("id", cursor)` 의 의미:**
- `lt` = Less Than (보다 작은)
- `cursor`가 91이면 → `WHERE id < 91`
- 이미 본 데이터(id >= 91)는 제외하고 그 다음 데이터만 가져옴

---

### `useInfinitePosts` - Hook 레이어

```typescript
export function useInfinitePosts(
  userId: string,
  familyId: string,
  category?: PostCategory,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    // 👇 쿼리 키: familyId와 category 조합
    queryKey: QUERY_KEYS.post.list(familyId, category),
    // → ["post", "list", "family-123", { category: "all" }]
    
    // 👇 데이터 fetching 함수
    queryFn: async ({ pageParam }) => {
      //                ↑
      // pageParam = 이전 페이지의 nextCursor 값
      // 첫 페이지: undefined
      // 2페이지: 91 (1페이지 마지막 id)
      // 3페이지: 81 (2페이지 마지막 id)
      
      const posts = await fetchPosts({
        userId,
        familyId,
        category,
        cursor: pageParam,  // 👈 pageParam을 cursor로 전달
        limit: PAGE_SIZE,
      });

      // 👇 캐시 정규화: 각 post를 byId 캐시에 저장
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
        // → ["post", 100] = { id: 100, content: "...", ... }
        // → ["post", 99]  = { id: 99, content: "...", ... }
        // → ...
      });

      // 👇 리스트 캐시에는 ID만 저장
      // 👇 여기서 nextCursor를 계산해서 반환!
      return {
        ids: posts.map((p) => p.id),  // [100, 99, 98, 97, 96, 95, 94, 93, 92, 91]
        nextCursor: posts.length === PAGE_SIZE 
          ? posts[posts.length - 1].id  // 91 (마지막 post의 id)
          : undefined,  // 데이터가 10개 미만이면 더 이상 없음
      };
    },

    // 👇 첫 페이지의 pageParam 값
    initialPageParam: undefined as number | undefined,
    
    // 👇 다음 페이지의 pageParam을 결정하는 함수
    // 👇 이 함수가 queryFn 반환값에서 nextCursor를 추출
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // lastPage.nextCursor가 undefined면 hasNextPage = false
    
    staleTime: STALE_TIME.STATIC,
    enabled: !!familyId,
  });
}
```

#### 흐름 시각화

```
┌─────────────────────────────────────────────────────────────┐
│                    useInfiniteQuery 내부                     │
└─────────────────────────────────────────────────────────────┘

[1페이지 요청]
  queryFn({ pageParam: undefined })  ← initialPageParam
       ↓
  fetchPosts({ userId, familyId, cursor: undefined }) → posts 10개 반환
       ↓
  return { ids: [...], nextCursor: 91 }  ← queryFn 반환값
       ↓
  getNextPageParam({ ids, nextCursor: 91 }) → 91 반환
       ↓
  TanStack Query가 91을 저장해둠 ✅


[2페이지 요청] fetchNextPage() 호출 시
  queryFn({ pageParam: 91 })  ← 저장해둔 값을 전달!
       ↓
  fetchPosts({ userId, familyId, cursor: 91 }) → posts 10개 반환
       ↓
  return { ids: [...], nextCursor: 81 }
       ↓
  getNextPageParam({ ids, nextCursor: 81 }) → 81 반환
       ↓
  TanStack Query가 81을 저장해둠 ✅


[마지막 페이지 요청]
  queryFn({ pageParam: 11 })
       ↓
  fetchPosts({ userId, familyId, cursor: 11 }) → posts 3개만 반환 (10개 미만)
       ↓
  return { ids: [...], nextCursor: undefined }  ← 더 이상 없음
       ↓
  getNextPageParam({ ids, nextCursor: undefined }) → undefined 반환
       ↓
  hasNextPage = false 됨 ✅
```

---

## 3. 전체 흐름 시각화

### 첫 페이지 로드

```
[사용자 액션] 피드 페이지 진입

[useInfinitePosts(session.user.id, currentFamilyId, category)]
  ↓ queryFn({ pageParam: undefined })
  
[fetchPosts]
  ↓ cursor가 없으므로 최신 10개 조회
  ↓ posts + post_likes + family_members + users 조회
  ↓ WHERE family_id = '...' AND post_likes.user_id = '...'
  ↓ ORDER BY created_at DESC LIMIT 10
  
[DB 응답]
  posts = [
    { id: 100, content: "최신 글", ... },
    { id: 99, content: "...", ... },
    ...
    { id: 91, content: "...", ... },
  ]

[캐시 정규화]
  ┌─────────────────────────────────────────┐
  │ ["post", 100] → { id: 100, ... }        │
  │ ["post", 99]  → { id: 99, ... }         │
  │ ...                                     │
  │ ["post", 91]  → { id: 91, ... }         │
  └─────────────────────────────────────────┘

[리스트 캐시]
  ┌─────────────────────────────────────────┐
  │ ["post", "list", familyId, {category}]  │
  │   pages: [                              │
  │     { ids: [100,99,98,...,91],          │
  │       nextCursor: 91 }                  │
  │   ]                                     │
  └─────────────────────────────────────────┘
```

### 두 번째 페이지 로드 (스크롤)

```
[사용자 액션] 스크롤하여 더 보기

[useInfinitePosts(session.user.id, currentFamilyId, category)]
  ↓ fetchNextPage() 호출됨
  ↓ getNextPageParam(lastPage) → 91 반환
  ↓ queryFn({ pageParam: 91 })

[fetchPosts]
  ↓ cursor = 91
  ↓ posts + post_likes + family_members + users 조회
  ↓ WHERE family_id = '...' AND post_likes.user_id = '...'
  ↓   AND id < 91  ← 핵심!
  ↓ ORDER BY created_at DESC LIMIT 10

[DB 응답]
  posts = [
    { id: 90, content: "...", ... },
    { id: 89, content: "...", ... },
    ...
    { id: 81, content: "...", ... },
  ]

[캐시 정규화]
  ┌─────────────────────────────────────────┐
  │ ["post", 100] → { ... } (기존)          │
  │ ...                                     │
  │ ["post", 91]  → { ... } (기존)          │
  │ ["post", 90]  → { ... } (신규 추가)     │
  │ ...                                     │
  │ ["post", 81]  → { ... } (신규 추가)     │
  └─────────────────────────────────────────┘

[리스트 캐시]
  ┌─────────────────────────────────────────┐
  │ ["post", "list", familyId, {category}]  │
  │   pages: [                              │
  │     { ids: [100,...,91], nextCursor: 91 }, ← 1페이지
  │     { ids: [90,...,81], nextCursor: 81 },  ← 2페이지 추가
  │   ]                                     │
  └─────────────────────────────────────────┘
```

---

## 4. 캐시 정규화의 이점

### Post 수정 시

```
[시나리오] id=95 게시글 수정

[Before]
  ["post", 95] → { id: 95, content: "원본 내용", ... }

[useUpdatePost] onSuccess
  queryClient.setQueryData(["post", 95], updatedPost);

[After]
  ["post", 95] → { id: 95, content: "수정된 내용", ... }

[결과]
  - 리스트 캐시(["post", "list", ...])는 ID만 가지고 있음
  - PostItem은 usePostById(95)로 개별 조회
  - byId 캐시가 업데이트되었으므로 PostItem이 자동으로 리렌더링
  - 어떤 리스트에서든 (all, notice, general) 같은 Post는 같은 캐시 참조
```

### 전통적인 방식과 비교

```
[전통적인 방식 - 리스트에 전체 데이터]

수정 시:
1. byId 캐시 업데이트
2. list 캐시도 순회하며 해당 post 찾아서 업데이트
3. 다른 category 리스트도 있으면 거기도 업데이트
→ 복잡하고 놓치기 쉬움

[정규화 방식 - 리스트는 ID만]

수정 시:
1. byId 캐시만 업데이트
→ 끝! 모든 리스트에 자동 반영
```

---

## 5. 핵심 포인트 요약

| 항목 | Offset 기반 | Cursor 기반 |
|------|------------|-------------|
| 기준점 | 순서 번호 (0, 10, 20...) | 마지막 본 항목의 고유 ID |
| 새 데이터 추가 시 | 중복/누락 발생 가능 | 문제 없음 |
| 랜덤 접근 | 가능 (5페이지로 바로 이동) | 불가능 (순차 접근만) |
| DB 성능 | OFFSET 클수록 느림 | 인덱스 활용으로 일정 |

**현재 구현의 핵심:**
1. **Cursor = 마지막 본 post의 id**
2. **`.lt("id", cursor)`** = 이미 본 것 이후의 데이터만
3. **nextCursor = 마지막 post.id** = 다음 요청의 기준점
4. **리스트는 ID만, 실제 데이터는 byId** = 캐시 정규화
