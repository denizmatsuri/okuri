import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: async (_, variables) => {
      // 해당 가족의 게시글 목록 캐시 무효화
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.post.list(variables.familyId),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
