import { Routes, Route, Navigate } from "react-router";
import GlobalLayout from "@/components/layout/global-layout";
import CalendarPage from "@/pages/calendar-page";
import IndexPage from "@/pages/index-page";
import GalleryPage from "@/pages/gallery-page";
import ProfilePage from "@/pages/profile-page";
import AuthLayout from "@/components/layout/auth-layout";
import SignUpPage from "@/pages/auth/sign-up-page";
import SignInPage from "@/pages/auth/sign-in-page";
import MemberOnlyLayout from "@/components/layout/member-only-layout";
import ForgetPasswordPage from "@/pages/forget-password-page";
import ResetPasswordPage from "@/pages/reset-password-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route element={<MemberOnlyLayout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
      </Route>

      {/* 정의되지 않은 모든 경로는 홈으로 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
