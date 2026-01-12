import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";
import { useMyFamilies } from "@/hooks/queries/use-family-data";

export default function FamilyRequiredLayout() {
  const session = useSession();
  const { data: families } = useMyFamilies(session?.user.id);

  if (!families || families.length === 0) {
    return <Navigate to="/no-family" replace />;
  }

  return <Outlet />;
}
