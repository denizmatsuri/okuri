import { Link, useNavigate } from "react-router";
import { Home, Calendar, Image, Moon, User, Plus, Menu } from "lucide-react";

import logo from "@/assets/react.svg";
import MenuButton from "./menu-button";
import { useSession } from "@/store/session";
import { useOpenCreatePostEditorModal } from "@/store/post-editor-modal";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function DesktopNav() {
  const session = useSession();
  const navigate = useNavigate();
  const openAlertModal = useOpenAlertModal();

  const openCreatePostEditorModal = useOpenCreatePostEditorModal();

  const handleProfileClick = () => {
    if (session?.user.id) {
      navigate(`/profile/${session.user.id}`);
    } else {
      openAlertModal({
        title: "로그인 후 이용해주세요.",
        description: "프로필 페이지에 접근하려면 로그인이 필요합니다.",
        onPositive: () => {
          navigate("/sign-in");
        },
      });
    }
  };

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
          <button
            onClick={openCreatePostEditorModal}
            className="bg-muted group flex h-14 w-12 cursor-pointer items-center justify-center rounded-xl"
          >
            <Plus className="text-muted-foreground group-hover:text-foreground h-7 w-7" />
          </button>
          <Link
            to="/gallery"
            className="hover:bg-muted flex h-14 w-12 items-center justify-center rounded-xl"
          >
            <Image className="text-muted-foreground h-7 w-7" />
          </Link>
          <button
            onClick={handleProfileClick}
            className="hover:bg-muted flex h-14 w-12 cursor-pointer items-center justify-center rounded-xl"
          >
            <User className="text-muted-foreground h-7 w-7" />
          </button>
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
