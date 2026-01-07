import { Home, Calendar, Image, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useSession } from "@/store/session";

export default function MobileNav() {
  const session = useSession();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (session?.user.id) {
      navigate(`/profile/${session.user.id}`);
    } else {
      alert("로그인 후 이용해주세요.");
    }
  };

  return (
    <nav className="bg-background fixed bottom-0 left-0 z-50 flex h-(--mobile-nav-height) w-full items-center justify-around border-t md:hidden">
      <Link
        to="/"
        className="bg-muted flex h-10 w-10 items-center justify-center rounded-xl"
      >
        <Home className="text-muted-foreground h-5 w-5" />
      </Link>
      <Link to="/" className="flex h-10 w-10 items-center justify-center">
        <Calendar className="text-muted-foreground h-5 w-5" />
      </Link>
      <Link to="/" className="flex h-10 w-10 items-center justify-center">
        <Image className="text-muted-foreground h-5 w-5" />
      </Link>
      <button
        onClick={handleProfileClick}
        className="flex h-10 w-10 cursor-pointer items-center justify-center"
      >
        <User className="text-muted-foreground h-5 w-5" />
      </button>
    </nav>
  );
}
