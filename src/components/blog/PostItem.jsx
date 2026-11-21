import { Link } from "react-router";
import TagChip from "../ui/TagChip.jsx";

export default function PostItem({ post }) {
  return (
    <li className="border-b border-line py-5 first:pt-0">
      <Link to={`/${post.lang}/blog/${post.slug}`} className="group block">
        <p className="font-mono text-xs text-muted">{post.date}</p>
        <h3 className="mt-1 text-lg font-medium group-hover:text-accent">{post.title}</h3>
        {post.summary && <p className="mt-1 text-sm text-muted">{post.summary}</p>}
      </Link>
      {post.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <TagChip key={t}>{t}</TagChip>
          ))}
        </div>
      )}
    </li>
  );
}
