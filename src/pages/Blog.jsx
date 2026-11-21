import { useState } from "react";
import PostItem from "../components/blog/PostItem.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import TagChip from "../components/ui/TagChip.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import { getPosts } from "../functions/content.js";
import { useLang, useT } from "../functions/i18n.js";

export default function Blog() {
  const lang = useLang();
  const t = useT();
  const [tag, setTag] = useState(null);
  const all = getPosts(lang);
  const tags = [...new Set(all.flatMap((p) => p.tags ?? []))];
  const posts = tag ? all.filter((p) => p.tags?.includes(tag)) : all;

  return (
    <PageFrame title={t.blog.title} heading={t.blog.title}>
      {tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <TagChip active={!tag} onClick={() => setTag(null)}>
            {t.blog.all}
          </TagChip>
          {tags.map((s) => (
            <TagChip key={s} active={tag === s} onClick={() => setTag(s)}>
              {s}
            </TagChip>
          ))}
        </div>
      )}
      {posts.length ? (
        <ul className="max-w-3xl">
          {posts.map((p) => (
            <PostItem key={p.slug} post={p} />
          ))}
        </ul>
      ) : (
        <EmptyState>{t.blog.empty}</EmptyState>
      )}
    </PageFrame>
  );
}
