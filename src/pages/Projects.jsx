import { useState } from "react";
import ProjectCard from "../components/project/ProjectCard.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import TagChip from "../components/ui/TagChip.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import { getProjects } from "../functions/content.js";
import { useLang, useT } from "../functions/i18n.js";

export default function Projects() {
  const lang = useLang();
  const t = useT();
  const [tag, setTag] = useState(null);
  const all = getProjects(lang);
  const tags = [...new Set(all.flatMap((p) => p.stack ?? []))];
  const items = tag ? all.filter((p) => p.stack?.includes(tag)) : all;

  return (
    <PageFrame title={t.projects.title} heading={t.projects.title}>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <TagChip active={!tag} onClick={() => setTag(null)}>
            {t.projects.all}
          </TagChip>
          {tags.map((s) => (
            <TagChip key={s} active={tag === s} onClick={() => setTag(s)}>
              {s}
            </TagChip>
          ))}
        </div>
      )}
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <EmptyState>{t.projects.empty}</EmptyState>
      )}
    </PageFrame>
  );
}
