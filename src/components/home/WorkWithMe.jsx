import SectionFrame from "../../frames/SectionFrame.jsx";
import { getProfile } from "../../functions/data.js";
import { useLang, useT } from "../../functions/i18n.js";
import Button from "../ui/Button.jsx";

export default function WorkWithMe() {
  const lang = useLang();
  const t = useT();
  const p = getProfile(lang);
  return (
    <SectionFrame title={t.home.work}>
      <div className="rounded-xl border border-line bg-surface p-6">
        <p className="text-muted">{t.home.workIntro}</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          {p.services.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <Button to={`/${lang}/contact`} className="mt-6">
          {t.cta.hire}
        </Button>
      </div>
    </SectionFrame>
  );
}
