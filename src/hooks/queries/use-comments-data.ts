import { fetchComments } from "@/api/comment";
import { QUERY_KEYS, STALE_TIME } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useCommentsData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.postComment.byPostId(postId),
    queryFn: () => fetchComments({ postId }),
    enabled: !!postId,
    staleTime: STALE_TIME.REALTIME,
  });
}
