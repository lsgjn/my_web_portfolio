import { Link, useLocation } from "react-router";
import { LANGS, useLang } from "../../functions/i18n.js";
import { getPost, getProject } from "../../functions/content.js";

function targetPath(pathname, to) {
  const [, , section, slug] = pathname.split("/");
  if (section === "projects" && slug) {
    return getProject(to, slug) ? `/${to}/projects/${slug}` : `/${to}/projects`;
  }
  if (section === "blog" && slug) {
    return getPost(to, slug) ? `/${to}/blog/${slug}` : `/${to}/blog`;
  }
  const rest = pathname.split("/").slice(2).join("/");
  return `/${to}${rest ? `/${rest}` : ""}`;
}

export default function LangSwitch() {
  const lang = useLang();
  const { pathname } = useLocation();
  return (
    <div className="flex items-center gap-2 font-mono text-xs" aria-label="Language">
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-line">|</span>}
          {l === lang ? (
            <span className="text-fg" aria-current="true">
              {l.toUpperCase()}
            </span>
          ) : (
            <Link to={targetPath(pathname, l)} className="text-muted hover:text-fg">
              {l.toUpperCase()}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
