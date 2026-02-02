import { createPostWithImages } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: async (newPost, variables) => {
      // 1. 정규화 캐시에 추가 (선택적 - fetchPostById로 채워도 됨)
      queryClient.setQueryData(QUERY_KEYS.post.byId(newPost.id), newPost);

      // 2. 캐시 리셋 (해당 가족의 모든 리스트)
      await queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.listByFamily(variables.familyId),
      });

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
