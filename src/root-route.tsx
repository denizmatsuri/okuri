import { Routes, Route, Navigate } from "react-router";
import GlobalLayout from "@/components/layout/global-layout";
import CalendarPage from "@/pages/calendar-page";
import IndexPage from "@/pages/index-page";
import GalleryPage from "@/pages/gallery-page";
import ProfilePage from "@/pages/auth/profile-page";
import AuthLayout from "@/components/layout/auth-layout";
import SignUpPage from "@/pages/auth/sign-up-page";
import SignInPage from "@/pages/auth/sign-in-page";
import MemberOnlyLayout from "@/components/layout/member-only-layout";
import ForgetPasswordPage from "@/pages/auth/forget-password-page";
import ResetPasswordPage from "@/pages/auth/reset-password-page";
import ProfileEditPage from "@/pages/auth/profile-edit-page";
import NoFamilyPage from "@/pages/family/no-family-page";
import FamilyRequiredLayout from "@/components/layout/family-required-layout";
import CreateFamilyPage from "@/pages/family/create-family-page";
import NoFamilyOnlyLayout from "@/components/layout/no-family-only-layout";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route element={<MemberOnlyLayout />}>
          {/* 가족 없이도 접근 가능한 페이지 */}
          <Route path="/family/create" element={<CreateFamilyPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 가족이 없는 사용자만 접근 가능 */}
          <Route element={<NoFamilyOnlyLayout />}>
            <Route path="/no-family" element={<NoFamilyPage />} />
          </Route>

          {/* 가족이 필요한 페이지 */}
          <Route element={<FamilyRequiredLayout />}>
            <Route path="/" element={<IndexPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Route>
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
