import { joinFamilyByInviteCode } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useJoinFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinFamilyByInviteCode,
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: QUERY_KEYS.family.all });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("가족 가입 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
