import { removeFamilyMember } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useRemoveFamilyMember(
  userId: string,
  callbacks?: MutationCallbacks,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFamilyMember,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.familiesWithMembersByUserId(userId),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("멤버 추방 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
