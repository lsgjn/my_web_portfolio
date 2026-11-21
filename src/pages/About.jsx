import Timeline from "../components/about/Timeline.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import SectionFrame from "../frames/SectionFrame.jsx";
import { getProfile, getTimeline } from "../functions/data.js";
import { useLang, useT } from "../functions/i18n.js";

export default function About() {
  const lang = useLang();
  const t = useT();
  const p = getProfile(lang);
  return (
    <PageFrame title={t.about.title} heading={t.about.title}>
      <div className="max-w-2xl space-y-4 text-muted">
        {p.about.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {p.strengths.map((s) => (
          <div key={s.title} className="rounded-xl border border-line bg-surface p-4">
            <h3 className="font-medium">{s.title}</h3>
            <p className="mt-1 text-sm text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
      <SectionFrame title={t.about.timeline} spacing="mt-14">
        <Timeline items={getTimeline(lang)} />
      </SectionFrame>
    </PageFrame>
  );
}
