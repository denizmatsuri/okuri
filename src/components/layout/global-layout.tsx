import { Outlet } from "react-router";
import Header from "@/components/layout/header";
import Navigation from "@/components/layout/navigation";

export default function GlobalLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-center md:flex-row">
      <div className="w-full flex-col md:ml-(--layout-narrow-width) md:max-w-(--layout-width)">
        <Header />
        <Outlet />
      </div>
      {/* 네비게이션 */}
      <Navigation />
    </div>
  );
}
