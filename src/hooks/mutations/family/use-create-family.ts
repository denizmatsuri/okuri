import { createFamilyWithMember } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFamilyWithMember,
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: QUERY_KEYS.family.list });
      // 그 다음 콜백 호출
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("가족 생성 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
