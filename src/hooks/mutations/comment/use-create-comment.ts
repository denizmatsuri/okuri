import { createComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks, Comment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateComment(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      callbacks?.onSuccess?.();

      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.postComment.byPostId(newComment.post_id),
        (comments) => {
          if (!comments) {
            console.error("댓글이 캐시 데이터에 보관되어있지 않습니다.");
            throw new Error("댓글이 캐시 데이터에 보관되어있지 않습니다.");
          }
          return [...comments, { ...newComment }];
        },
      );
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
