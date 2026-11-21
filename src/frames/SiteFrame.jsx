import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Footer from "../components/nav/Footer.jsx";
import Header from "../components/nav/Header.jsx";
import { LANGS, useLang, useT } from "../functions/i18n.js";
import NotFound from "../pages/NotFound.jsx";

/**
 * 사이트 전체 틀: 헤더 + 본문(max-width) + 푸터.
 * 속성: 없음 (라우트의 :lang 값으로 언어를 결정)
 */
export default function SiteFrame() {
  const lang = useLang();
  const t = useT();
  const { pathname } = useLocation();
  const valid = LANGS.includes(pathname.split("/")[1]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!valid) return <NotFound bare />;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-[1120px] flex-1 px-4 py-10 md:px-6">
        <Outlet />
      </main>
      <Footer text={t.footer} />
    </div>
  );
}
