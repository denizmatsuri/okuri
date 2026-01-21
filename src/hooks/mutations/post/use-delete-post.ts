import { deletePost } from "@/api/post";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (_, variables) => {
      // 캐시 리셋 (해당 가족의 모든 리스트)
      // - prefix matching으로 모든 카테고리(all, notice, free 등) 포함
      //   (QUERY_KEYS.post.list()는 특정 category만 매칭되므로 직접 배열 작성)
      await queryClient.resetQueries({
        queryKey: ["post", "list", variables.family_id],
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
