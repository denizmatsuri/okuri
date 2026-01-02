import { Link } from "react-router";
import { Home, Calendar, Image, Moon, User, Plus, Menu } from "lucide-react";

import logo from "@/assets/react.svg";
import MenuButton from "./menu-button";

export default function DesktopNav() {
  return (
    <nav className="bg-background fixed top-0 left-0 z-50 hidden h-full w-(--layout-narrow-width) flex-col justify-center gap-4 border-r md:flex">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {/* 로고 */}
        <Link to="/" className="flex items-center justify-center py-3">
          <img src={logo} alt="logo" className="h-10 w-10" />
        </Link>

        {/* 메인 네비게이션 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <Link
            to="/"
            className="hover:bg-muted flex h-14 w-12 items-center justify-center rounded-xl"
          >
            <Home className="text-muted-foreground h-7 w-7" />
          </Link>
          <Link
            to="/calendar"
            className="hover:bg-muted flex h-14 w-12 items-center justify-center rounded-xl"
          >
            <Calendar className="text-muted-foreground h-7 w-7" />
          </Link>
          {/* 피드 추가 버튼 */}
          <button className="bg-muted flex h-14 w-12 items-center justify-center rounded-xl">
            <Plus className="text-muted-foreground h-7 w-7" />
          </button>
          <Link
            to="/gallery"
            className="hover:bg-muted flex h-14 w-12 items-center justify-center rounded-xl"
          >
            <Image className="text-muted-foreground h-7 w-7" />
          </Link>
          <Link
            to="/profile"
            className="hover:bg-muted flex h-14 w-12 items-center justify-center rounded-xl"
          >
            <User className="text-muted-foreground h-7 w-7" />
          </Link>
        </div>

        {/* 설정 영역 */}
        <div className="mb-3 flex flex-col items-center justify-center gap-2">
          <button className="hover:bg-muted flex h-14 w-12 cursor-pointer items-center justify-center rounded-xl">
            <Moon className="text-muted-foreground h-7 w-7" />
          </button>
          {/* 메뉴 버튼 */}
          <MenuButton>
            <button className="hover:bg-muted flex h-14 w-12 cursor-pointer items-center justify-center rounded-xl">
              <Menu className="text-muted-foreground h-7 w-7" />
            </button>
          </MenuButton>
        </div>
      </div>
    </nav>
  );
}
