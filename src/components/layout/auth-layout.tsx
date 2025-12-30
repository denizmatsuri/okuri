import { Navigate, Outlet } from "react-router";
import Footer from "./footer";
import { useSession } from "@/store/session";

export default function AuthLayout() {
  const session = useSession();

  // 이미 로그인된 경우 홈으로 리다이렉트
  if (session) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-center">
      <Outlet />
      <Footer />
    </div>
  );
}
