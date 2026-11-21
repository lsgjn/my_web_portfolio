import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import SiteFrame from "./frames/SiteFrame.jsx";
import About from "./pages/About.jsx";
import Blog from "./pages/Blog.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Projects from "./pages/Projects.jsx";

// 관리자 화면은 개발 서버(import.meta.env.DEV)에서만 존재한다.
// 배포 빌드에서는 이 조건이 false로 치환되어 관리자 코드가 번들에서 제거된다.
const AdminPage = import.meta.env.DEV ? lazy(() => import("./pages/admin/AdminPage.jsx")) : null;

function RootRedirect() {
  const lang = navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en";
  return <Navigate to={`/${lang}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      {AdminPage && (
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <AdminPage />
            </Suspense>
          }
        />
      )}
      <Route path=":lang" element={<SiteFrame />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<PostDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
