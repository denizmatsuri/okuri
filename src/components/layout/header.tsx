import { Link } from "react-router";
import logo from "@/assets/react.svg";
import { Menu } from "lucide-react";
import MenuButton from "./navigation/menu-button";

//Header는 모바일일때만 상단에 고정되어 있음
export default function Header() {
  return (
    <header className="bg-background fixed top-0 left-0 flex h-(--mobile-header-height) w-full md:hidden">
      <div className="grid h-full w-full grid-cols-3 items-center px-4">
        {/* 왼쪽 빈 공간 */}
        <div />

        {/* 로고 버튼 */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8" />
          </Link>
        </div>

        {/* 메뉴 버튼 */}
        <MenuButton>
          <div className="flex justify-end">
            <Menu className="text-muted-foreground h-8 cursor-pointer" />
          </div>
        </MenuButton>
      </div>
    </header>
  );
}
