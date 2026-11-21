import { useState } from "react";
import Button from "../components/ui/Button.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import { getProfile } from "../functions/data.js";
import { useLang, useT } from "../functions/i18n.js";

export default function Contact() {
  const lang = useLang();
  const t = useT();
  const p = getProfile(lang);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(p.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <PageFrame title={t.contact.title} heading={t.contact.title}>
      <p className="max-w-xl text-muted">{t.contact.intro}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {p.email ? (
          <>
            <a href={`mailto:${p.email}`} className="font-mono text-accent hover:underline">
              {p.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-line px-2 py-0.5 text-xs text-muted hover:text-fg"
            >
              {copied ? t.contact.copied : t.contact.copy}
            </button>
          </>
        ) : (
          <span className="text-sm text-muted">{t.notFilled}</span>
        )}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {p.github && (
          <Button href={p.github} target="_blank" variant="ghost">
            GitHub
          </Button>
        )}
        {p.resume && (
          <Button href={p.resume} target="_blank">
            {t.cta.resume}
          </Button>
        )}
      </div>
    </PageFrame>
  );
}
