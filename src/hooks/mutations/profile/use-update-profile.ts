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

      queryClient.setQueryData<UserEntity>(
        QUERY_KEYS.userProfile.byId(updatedProfile.id),
        updatedProfile,
      );
    },
  });
}
