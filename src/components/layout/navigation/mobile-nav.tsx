import { Home, Calendar, Image, User, Plus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { useSession } from "@/store/session";
import { cn } from "@/lib/utils";
import { usePostEditorAction } from "@/hooks/use-post-editor-action";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function MobileNav() {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const openAlertModal = useOpenAlertModal();

  const { handleOpenCreateModal } = usePostEditorAction();

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

  const navItemClass =
    "flex h-full items-center justify-center px-4 transition-colors relative";
  const isHomeActive =
    location.pathname === "/" || location.pathname.startsWith("/post");
  const isProfileActive = location.pathname.startsWith("/profile");

  return (
    <nav className="bg-background fixed bottom-0 left-0 z-50 flex h-(--mobile-nav-height) w-full items-center justify-evenly border-t md:hidden">
      <Link to="/" className={navItemClass}>
        <Home
          className={cn(
            "text-muted-foreground h-7 w-7",
            isHomeActive && "text-foreground",
          )}
        />
      </Link>
      <div
        onClick={() => {
          openAlertModal({
            title: "캘린더 페이지는 준비중입니다.",
            description: "캘린더 페이지는 준비중입니다.",
          });
        }}
        className={navItemClass}
      >
        <Calendar className="text-muted-foreground h-7 w-7" />
      </div>
      <button onClick={handleOpenCreateModal} className={navItemClass}>
        <Plus className="text-muted-foreground h-7 w-7" />
      </button>
      <div
        onClick={() => {
          openAlertModal({
            title: "갤러리 페이지는 준비중입니다.",
            description: "갤러리 페이지는 준비중입니다.",
          });
        }}
        className={navItemClass}
      >
        <Image className="text-muted-foreground h-7 w-7" />
      </div>
      <button onClick={handleProfileClick} className={navItemClass}>
        <User
          className={cn(
            "text-muted-foreground h-7 w-7",
            isProfileActive && "text-foreground",
          )}
        />
      </button>
    </nav>
  );
}
