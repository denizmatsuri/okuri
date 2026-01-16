import { fetchPosts, fetchPostById } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

/**
 * 가족 게시글 목록 조회
 */
export function usePostsData(familyId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.post.list(familyId),
    queryFn: () => fetchPosts(familyId),
    enabled: !!familyId,
  });
}

/**
 * 단일 게시글 상세 조회
 */
export function usePostById(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId),
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });
}
