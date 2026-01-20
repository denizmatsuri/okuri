import { createPostWithImages } from "@/api/post";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: async (_, variables) => {
      // 1. 정규화 캐시에 추가 (선택적 - fetchPostById로 채워도 됨)
      // queryClient.setQueryData(QUERY_KEYS.post.byId(newPost.id), newPost);

      // 2. 캐시 리셋 (해당 가족의 모든 리스트)
      // - resetQueries 사용 이유: 새 글이 맨 상위에 노출되므로 리셋해도 무방
      // - prefix matching으로 모든 카테고리(all, notice, free 등) 포함
      //   (QUERY_KEYS.post.list()는 특정 category만 매칭되므로 직접 배열 작성)
      await queryClient.resetQueries({
        queryKey: ["post", "list", variables.familyId],
      });

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
