import { updatePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks, Post } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePost(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

    // mutation 시작 전 이전 상태 저장 (context로 전달)
    onMutate: async (variables) => {
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(variables.id),
      );
      return { prevIsNotice: prevPost?.is_notice };
    },

    onSuccess: async (updatedPost, _, context) => {
      // 1. 정규화 캐시 업데이트 (familyMember는 prev에서 유지)
      queryClient.setQueryData<Post>(
        QUERY_KEYS.post.byId(updatedPost.id),
        (prev) => (prev ? { ...prev, ...updatedPost } : prev),
      );

      // 2. is_notice 변경 시 해당 가족의 리스트만 무효화
      // - prefix matching으로 모든 카테고리 포함
      // - invalidate 사용: 기존 스크롤 위치 유지
      if (context?.prevIsNotice !== updatedPost.is_notice) {
        await queryClient.invalidateQueries({
          queryKey: ["post", "list", updatedPost.family_id],
        });
      }

      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("게시글 수정 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
