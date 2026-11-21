import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useLang, useT } from "../../functions/i18n.js";
import { getProfile } from "../../functions/data.js";
import LangSwitch from "./LangSwitch.jsx";

export default function Header() {
  const lang = useLang();
  const t = useT();
  const [open, setOpen] = useState(false);
  const items = [
    ["projects", t.nav.projects],
    ["blog", t.nav.blog],
    ["about", t.nav.about],
    ["contact", t.nav.contact],
  ];
  const linkClass = ({ isActive }) =>
    `transition-colors hover:text-fg ${isActive ? "text-fg" : "text-muted"}`;

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center justify-between px-4 md:px-6">
        <Link to={`/${lang}`} className="font-mono text-sm text-muted hover:text-fg">
          &lt;{getProfile(lang).name} /&gt;
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {items.map(([path, label]) => (
            <NavLink key={path} to={`/${lang}/${path}`} className={linkClass}>
              {label}
            </NavLink>
          ))}
          <LangSwitch />
        </nav>
        <button
          type="button"
          className="-mr-2 flex h-10 w-10 items-center justify-center text-lg text-muted md:hidden"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-4 border-t border-line px-4 py-4 text-sm md:hidden">
          {items.map(([path, label]) => (
            <NavLink
              key={path}
              to={`/${lang}/${path}`}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <LangSwitch />
        </nav>
      )}
    </header>
  );
}
