import { Home, Calendar, Image, Menu } from "lucide-react";
import { Link } from "react-router";
import MenuButton from "@/components/layout/navigation/menu-button";

export default function MobileNav() {
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
      <MenuButton>
        <button className="flex h-10 w-10 items-center justify-center">
          <Menu className="text-muted-foreground h-5 w-5" />
        </button>
      </MenuButton>
    </nav>
  );
}
