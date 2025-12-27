import { Routes, Route } from "react-router";
import GlobalLayout from "./components/layout/global-layout";
import CalendarPage from "./pages/calendar-page";
import IndexPage from "./pages/index-page";
import GalleryPage from "./pages/gallery-page";
import ProfilePage from "./pages/profile-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/sign-in" element={<div>Sign In</div>} />
        <Route path="/sign-up" element={<div>Sign Up</div>} />
      </Route>
    </Routes>
  );
}
