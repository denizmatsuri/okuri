import { useMutation } from "@tanstack/react-query";
import { signInWithOAuth } from "@/api/auth";
import type { Provider } from "@supabase/supabase-js";
import type { MutationCallbacks } from "@/types";

interface SignInWithOAuthVariables {
  provider: Provider;
  redirectTo?: string;
  queryParams?: { [key: string]: string };
}

export function useSignInWithOAuth(callbacks?: MutationCallbacks) {

  return useMutation({
    mutationFn: (variables: SignInWithOAuthVariables) =>
      signInWithOAuth(variables),
    onSuccess: () => {
      callbacks?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error(error);
      callbacks?.onError?.(error);
    },
  });
}
