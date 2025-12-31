import { signInWithPassword } from "@/api/auth";
import type { MutationCallbacks } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useSignInWithPassword(callbacks?: MutationCallbacks) {
  return useMutation({
    mutationFn: signInWithPassword,
    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
