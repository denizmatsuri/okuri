import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFamilyMember } from "@/api/family";
import { QUERY_KEYS } from "@/lib/constants";
import type { MutationCallbacks } from "@/types";

export function useUpdateFamilyMember(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.family.all,
      });
      callbacks?.onSuccess?.();
    },
    onError: (error: Error) => {
      callbacks?.onError?.(error);
    },
    onMutate: callbacks?.onMutate,
    onSettled: callbacks?.onSettled,
  });
}
