import { updateFamily } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFamily(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFamily,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.family.all });
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
