import { regenerateInviteCode } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegenerateInviteCode(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: regenerateInviteCode,
    onSuccess: async (_, familyId) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.byId(familyId),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("초대 코드 재생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
