import { updateUserProfile } from "@/api/profile";
import { QUERY_KEYS } from "@/lib/constants";
import type { UserEntity, MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onError: (error) => {
      // console.error(error);
      callbacks?.onError?.(error);
    },
    onSuccess: (updatedProfile) => {
      callbacks?.onSuccess?.();

      // 프로필 쿼리 업데이트
      queryClient.setQueryData<UserEntity>(
        QUERY_KEYS.userProfile.byId(updatedProfile.id),
        updatedProfile,
      );

      // 프로필 이미지가 사용되는 관련 쿼리 리셋 (다음 마운트 시 새로 fetch)
      queryClient.resetQueries({ queryKey: QUERY_KEYS.post.all });
      queryClient.resetQueries({ queryKey: QUERY_KEYS.family.all });
      queryClient.resetQueries({ queryKey: QUERY_KEYS.postComment.all });
    },
  });
}
