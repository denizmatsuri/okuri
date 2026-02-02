import { deletePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (_, variables) => {
      // 캐시 리셋 (해당 가족의 모든 리스트)
      await queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.listByFamily(variables.family_id),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
