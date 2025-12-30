import { useIsSessionLoaded, useSession, useSetSession } from "@/store/session";
import supabase from "@/utils/supabase";
import { useEffect } from "react";
import GlobalLoader from "@/components/global-loader";
import { useUserProfileData } from "@/hooks/queries/use-profile-data";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  /**
   * 📦 프로필 데이터 프리페칭
   *
   * 앱 초기화 시 로그인한 사용자의 프로필을 미리 로드합니다.
   * - React Query 캐시에 저장 → 다른 컴포넌트에서 재사용 가능
   * - 타 사용자 프로필은 각 컴포넌트에서 개별 조회
   *
   * @note isLoading vs isPending
   * - isLoading: 데이터가 없고 fetch 중일 때만 true (초기 로딩)
   * - isPending: 쿼리가 비활성화되어도 true일 수 있음
   */
  const { isLoading: isProfileLoading } = useUserProfileData(session?.user.id);

  /**
   * 🔐 세션 상태 동기화
   *
   * Supabase Auth 이벤트를 구독하여 세션 변경 시 전역 상태를 업데이트합니다.
   * (로그인, 로그아웃, 토큰 갱신 등)
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  // 세션 또는 프로필 로딩 중이면 로더 표시
  if (!isSessionLoaded || isProfileLoading) {
    return <GlobalLoader />;
  }

  return children;
}
