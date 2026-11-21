import { useLang } from "../../functions/i18n.js";
import { getProfile } from "../../functions/data.js";

export default function Footer({ text }) {
  const p = getProfile(useLang());
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted md:px-6">
        <span>
          {text} {p.name}
        </span>
        <span className="flex gap-4">
          {p.email && (
            <a href={`mailto:${p.email}`} className="hover:text-fg">
              Email
            </a>
          )}
          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
              GitHub
            </a>
          )}
        </span>
      </div>
    </footer>
  );
}
