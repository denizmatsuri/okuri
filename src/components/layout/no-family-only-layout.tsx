import { Navigate, Outlet } from "react-router";
import { useSession } from "@/store/session";
import { useMyFamilies } from "@/hooks/queries/use-family-data";

/**
 * 가족이 없는 사용자만 접근 가능한 레이아웃
 * 가족이 있으면 홈으로 리다이렉트
 */
export default function NoFamilyOnlyLayout() {
  const session = useSession();
  const { data: families } = useMyFamilies(session?.user.id);

  // 가족이 있으면 홈으로 리다이렉트
  if (families && families.length > 0) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
