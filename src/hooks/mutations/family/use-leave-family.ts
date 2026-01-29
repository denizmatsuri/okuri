import { leaveFamily } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLeaveFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveFamily,
    onSuccess: async () => {
      await queryClient.resetQueries({
        queryKey: QUERY_KEYS.family.all,
      });
      await queryClient.resetQueries({
        queryKey: QUERY_KEYS.post.all,
      });
      await queryClient.resetQueries({
        queryKey: QUERY_KEYS.postComment.all,
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      callbacks?.onError?.(error);
    },
  });
}
