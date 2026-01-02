import { sendResetPasswordEmail } from "@/api/auth";
import type { MutationCallbacks } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useSendResetPasswordEmail(callbacks?: MutationCallbacks) {
  return useMutation({
    mutationFn: sendResetPasswordEmail,
    onSuccess: () => {
      callbacks?.onSuccess?.();
    },
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
