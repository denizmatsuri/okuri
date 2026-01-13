import { leaveFamily } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLeaveFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveFamily,
    onSuccess: async () => {
      // family 관련 모든 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.all,
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("가족 탈퇴 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
