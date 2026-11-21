import { Link } from "react-router";
import { withBase } from "../../functions/url.js";
import TagChip from "../ui/TagChip.jsx";

export default function ProjectCard({ project }) {
  return (
    <Link
      to={`/${project.lang}/projects/${project.slug}`}
      className="group overflow-hidden rounded-xl border border-line bg-surface transition hover:border-accent"
    >
      {project.thumbnail ? (
        <img src={withBase(project.thumbnail)} alt="" loading="lazy" className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 bg-surface-2" aria-hidden="true" />
      )}
      <div className="p-4">
        <h3 className="font-medium">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{project.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.stack?.map((s) => (
            <TagChip key={s}>{s}</TagChip>
          ))}
        </div>
      </div>
    </Link>
  );
}
