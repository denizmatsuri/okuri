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
      // queryClient.setQueryData(QUERY_KEYS.post.byId(newPost.id), newPost);
    
      // 2. 해당 카테고리 리스트 invalidate
      const category = variables.isNotice ? "notice" : "general";
      
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.post.list(variables.familyId, category),
      });
      
      // "all" 카테고리도 invalidate
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.post.list(variables.familyId, "all"),
      });
    
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
