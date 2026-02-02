import { Link } from "react-router";
import logo from "@/assets/logo.svg";
import MenuButton from "./navigation/menu-button";

//Header는 모바일일때만 상단에 고정되어 있음
export default function Header() {
  return (
    <header className="bg-background/50 fixed top-0 left-0 z-50 flex h-(--mobile-header-height) w-full backdrop-blur-md md:hidden">
      <div className="grid h-full w-full grid-cols-3 items-center px-4">
        {/* 왼쪽 빈 공간 */}
        <div />

        {/* 로고 버튼 */}
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-12" />
          </Link>
        </div>

        {/* 메뉴 버튼 */}
        <MenuButton />
      </div>
    </header>
  );
}
