import { deleteFamily } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFamily,
    onSuccess: async () => {
      await queryClient.resetQueries({
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
