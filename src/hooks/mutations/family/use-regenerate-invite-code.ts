import { regenerateInviteCode } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRegenerateInviteCode(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId }: { familyId: string; userId: string }) =>
      regenerateInviteCode(familyId),
    onSuccess: async (_, { userId }) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.familiesWithMembersByUserId(userId),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("초대 코드 재생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
