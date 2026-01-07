import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";
import { useMyFamilies } from "@/hooks/queries/use-family-data"; // 나중에 구현

export default function FamilyRequiredLayout() {
  const session = useSession();
  const { data: families, isLoading } = useMyFamilies(session?.user.id);

  // if (isLoading) return <GlobalLoader />;
  if (!families || families.length === 0) {
    return <Navigate to="/no-family" replace />;
  }

  return <Outlet />;
}
