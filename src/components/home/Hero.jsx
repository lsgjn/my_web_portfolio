import { useLang, useT } from "../../functions/i18n.js";
import { getProfile } from "../../functions/data.js";
import Button from "../ui/Button.jsx";

export default function Hero() {
  const lang = useLang();
  const t = useT();
  const p = getProfile(lang);
  return (
    <section className="py-12 md:py-20">
      <p className="mb-3 font-mono text-xs text-accent">{p.label}</p>
      <h1 className="whitespace-pre-line text-3xl font-medium leading-tight md:text-5xl">
        {p.headline}
      </h1>
      <p className="mt-5 max-w-xl text-muted">{p.intro}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {p.resume && (
          <Button href={p.resume} target="_blank">
            {t.cta.resume}
          </Button>
        )}
        <Button to={`/${lang}/contact`} variant="ghost">
          {t.cta.hire}
        </Button>
      </div>
    </section>
  );
}
