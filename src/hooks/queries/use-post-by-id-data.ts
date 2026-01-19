import { fetchPostById } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function usePostById(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5분 - 이미 캐시에 있으면 재요청 안함
  });
}