import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="absolute bottom-0 left-0 h-(--footer-height) w-full">
      <div className="relative flex h-full items-center justify-center gap-4">
        <span className="text-muted-foreground text-sm">© 2025</span>
        <Link
          to="/terms"
          className="text-muted-foreground text-sm hover:underline"
        >
          Okuri 약관
        </Link>
        <Link
          to="/privacy"
          className="text-muted-foreground text-sm hover:underline"
        >
          개인정보처리방침
        </Link>
        <button className="text-muted-foreground cursor-pointer text-sm hover:underline">
          문제 신고
        </button>
      </div>
    </footer>
  );
}
