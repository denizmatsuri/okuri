import { togglePostLike } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import { type Post, type MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useTogglePostLike(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,

    // 낙관적 업데이트: 서버 요청 전에 UI를 먼저 업데이트
    onMutate: async ({ postId }) => {
      // 1. 진행 중인 쿼리 취소 (혹시모를 데이터 충돌 방지)
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      // 2. 현재 포스트 상태 백업 (에러 시 롤백용)
      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );

      // 3. UI 즉시 업데이트 (서버 응답 전)
      queryClient.setQueryData<Post>(QUERY_KEYS.post.byId(postId), (post) => {
        if (!post) throw new Error("포스트가 존재하지 않습니다.");
        return {
          ...post,
          isLiked: !post.isLiked, // 좋아요 상태 토글
          like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1,
        };
      });

      // 4. 백업 데이터 반환 (onError에서 사용)
      return {
        prevPost,
      };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    // 서버 요청 실패 시 - 이전 상태로 롤백
    onError: (error, _, context) => {
      // 백업해둔 이전 상태로 복원
      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
