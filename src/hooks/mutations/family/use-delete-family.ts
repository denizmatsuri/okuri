import { deleteFamily } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFamily,
    onSuccess: async () => {
      // family 관련 모든 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.all,
      });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      console.error("가족 삭제 실패:", error);
      callbacks?.onError?.(error);
    },
  });
}
