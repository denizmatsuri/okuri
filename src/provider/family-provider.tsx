import { useSession } from "@/store/session";
import { useMyFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import GlobalLoader from "@/components/global-loader";
import { useEffect } from "react";
import { useCurrentFamilyId, useSetCurrentFamilyId } from "@/store/family";

export default function FamilyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const currentFamilyId = useCurrentFamilyId();
  const setCurrentFamilyId = useSetCurrentFamilyId();

  /**
   * 📦 가족 데이터 프리페칭
   *
   * 로그인한 사용자의 가족 목록을 앱 시작 시 미리 로드합니다.
   * React Query 캐시에 저장되어 다른 컴포넌트에서 재사용 가능.
   */
  const { data: families, isLoading } = useMyFamiliesWithMembers(
    session?.user.id,
  );

  /**
   * 🎯 currentFamilyId 자동 설정
   *
   * - 선택된 가족이 없거나
   * - 선택된 가족이 목록에 없으면 (탈퇴 등)
   * → 첫 번째 가족을 자동 선택
   */
  useEffect(() => {
    if (isLoading) return;

    if (!families || families.length === 0) {
      // 가족이 없으면 null로 초기화 후 return
      if (currentFamilyId !== null) {
        setCurrentFamilyId(null);
      }
      return;
    }

    // 선택된 가족이 목록에 있는지 확인
    const isValidSelection = families.some(
      (f) => f.family?.id === currentFamilyId,
    );

    // 선택된 가족이 목록에 없으면 첫 번째 가족을 선택
    if (!currentFamilyId || !isValidSelection) {
      setCurrentFamilyId(families[0].family?.id ?? null);
    }
  }, [families, currentFamilyId, setCurrentFamilyId, isLoading]);

  if (session && isLoading) {
    return <GlobalLoader />;
  }

  return children;
}
