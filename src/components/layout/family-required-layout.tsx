import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";
import { useMyFamiliesWithMembers } from "@/hooks/queries/use-family-data";
import GlobalLoader from "@/components/global-loader";

export default function FamilyRequiredLayout() {
  const session = useSession();
  const { data: families, isLoading } = useMyFamiliesWithMembers(
    session?.user.id,
  );

  // 로딩 중일 때는 대기
  if (isLoading) {
    return <GlobalLoader />;
  }

  if (!families || families.length === 0) {
    return <Navigate to="/no-family" replace />;
  }

  return <Outlet />;
}
