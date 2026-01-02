import DesktopNav from "./navigation/desktop-nav";
import MobileNav from "./navigation/mobile-nav";

export default function Navigation() {
  return (
    <>
      {/* PC/태블릿: 왼쪽 세로 네비게이션 */}
      <DesktopNav />

      {/* 모바일: 하단 가로 네비게이션 */}
      <MobileNav />
    </>
  );
}
