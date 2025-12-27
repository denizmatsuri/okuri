import { Link } from "react-router";
import logo from "@/assets/react.svg";
import { Menu } from "lucide-react";
import defaultAvatar from "@/assets/default-avatar.jpg";

//Header는 모바일일때만 상단에 고정되어 있음
export default function Header() {
  return (
    <header className="bg-background fixed top-0 left-0 flex h-(--mobile-header-height) w-full md:hidden">
      <div className="grid h-full w-full grid-cols-3 items-center px-4">
        {/* 메뉴 버튼 */}
        <div className="flex justify-start">
          <Menu className="text-muted-foreground h-8 cursor-pointer" />
        </div>

        {/* 로고 버튼 */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8" />
          </Link>
        </div>

        {/* 프로필 버튼 */}
        <div className="flex justify-end">
          <Link to="/profile">
            <img
              src={defaultAvatar}
              alt="avatar"
              className="h-8 rounded-full border"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
