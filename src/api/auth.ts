import supabase from "@/lib/supabase";
import type { Provider } from "@supabase/supabase-js";

export async function signUp({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signInWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * 로그아웃 처리
 *
 * 서버 로그아웃 실패 시에도 scope: "local"로 로컬 세션을 삭제하여
 * 클라이언트에서는 항상 로그아웃 상태가 보장됩니다.
 * 에러를 throw하지 않으므로 mutation 래핑 없이 직접 호출 가능합니다.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    await supabase.auth.signOut({
      scope: "local",
    });
  }
}

export async function sendResetPasswordEmail({ email }: { email: string }) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_PUBLIC_URL}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword({ password }: { password: string }) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
export async function signInWithOAuth({
  provider,
  redirectTo,
  queryParams,
}: {
  provider: Provider;
  redirectTo?: string;
  queryParams?: { [key: string]: string };
}
) {
  // redirectTo가 제공되지 않았을 경우, window.location.origin을 사용합니다.
  // 주의: Supabase Console의 Redirect URLs에 해당 URL이 등록되어 있어야 합니다.
  const finalRedirectTo = redirectTo ?? window.location.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: finalRedirectTo,
      queryParams,
    },
  });

  if (error) throw error;
  return data;
}
