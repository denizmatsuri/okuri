import { grantAdminRole } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useGrantAdmin(userId: string, callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: grantAdminRole,
    onSuccess: async () => {
      // 해당 유저의 가족 멤버 목록만 무효화
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.members(userId),
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("관리자 권한 부여 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
