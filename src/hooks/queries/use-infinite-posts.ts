import { fetchPosts } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { PostCategory } from "@/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

/**
 * 무한스크롤 페이지 크기
 */
export const PAGE_SIZE = 10;

export function useInfinitePosts(
  familyId: string, 
  category?: PostCategory
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.post.list(familyId, category),
    
    queryFn: async ({ pageParam }) => {
      const posts = await fetchPosts({
        familyId,
        category,
        cursor: pageParam,
        limit: PAGE_SIZE,
      });

      // 캐시 정규화
      posts.forEach((post) => {
        queryClient.setQueryData(QUERY_KEYS.post.byId(post.id), post);
        // → ["post", 100] = { id: 100, content: "...", ... }
        // → ["post", 99]  = { id: 99, content: "...", ... }
        // → ...
      });

      return {
        ids: posts.map((p) => p.id),
        nextCursor: posts.length === PAGE_SIZE 
          ? posts[posts.length - 1].id 
          : undefined,
      };
    },

    initialPageParam: undefined as number | undefined,
    
    getNextPageParam: (lastPage) => lastPage.nextCursor,

    staleTime: 1000 * 60 * 5, // 5분 (또는 Infinity + invalidate 전략)
    enabled: !!familyId,
  });
}