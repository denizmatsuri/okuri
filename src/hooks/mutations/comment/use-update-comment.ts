import { updateComment } from "@/api/comment";
import { QUERY_KEYS } from "@/lib/constants";
import type { Comment, MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateComment(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onError: (error) => {
      // console.error(error);
      callbacks?.onError?.(error);
    },
    onSuccess: (updatedComment) => {
      callbacks?.onSuccess?.();

      queryClient.setQueryData<Comment[]>(
        QUERY_KEYS.postComment.byPostId(updatedComment.post_id),
        (comments) => {
          if (!comments)
            throw new Error("댓글이 캐시 데이터에 보관되어있지 않습니다.");

          return comments.map((comment) => {
            if (comment.id === updatedComment.id)
              return { ...comment, ...updatedComment };
            return comment;
          });
        },
      );
    },
  });
}
