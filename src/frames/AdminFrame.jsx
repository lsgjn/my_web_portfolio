import { Link } from "react-router";

/**
 * 관리자 틀 (개발 서버 전용). 상단 경고 바 + 넓은 작업 영역.
 */
export default function AdminFrame({ children }) {
  return (
    <div className="min-h-screen">
      <title>Admin</title>
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4">
          <span className="font-mono text-sm text-accent">ADMIN · local only</span>
          <Link to="/" className="text-sm text-muted hover:text-fg">
            사이트 보기 →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-4 py-8">{children}</main>
    </div>
  );
}
