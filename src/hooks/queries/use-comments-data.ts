import { fetchComments } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export function useCommentsData(postId: number, familyId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.postComment.byPostId(postId),
    queryFn: () => fetchComments({ postId, familyId }),
    enabled: !!postId && !!familyId,
  });
}
