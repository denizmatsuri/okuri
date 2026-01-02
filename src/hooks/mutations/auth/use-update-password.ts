import { updatePassword } from "@/api/auth";
import type { MutationCallbacks } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useUpdatePassword(callbacks?: MutationCallbacks) {
  return useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
