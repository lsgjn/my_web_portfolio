import SectionFrame from "../../frames/SectionFrame.jsx";
import { getFeaturedProjects } from "../../functions/content.js";
import { useLang, useT } from "../../functions/i18n.js";
import ProjectCard from "../project/ProjectCard.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function FeaturedProjects() {
  const lang = useLang();
  const t = useT();
  const items = getFeaturedProjects(lang);
  return (
    <SectionFrame title={t.home.featured} to={`/${lang}/projects`} linkLabel={t.home.viewAll}>
      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <EmptyState>{t.projects.empty}</EmptyState>
      )}
    </SectionFrame>
  );
}
