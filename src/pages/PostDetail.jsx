import { Link, useParams } from "react-router";
import Markdown from "../components/blog/Markdown.jsx";
import TagChip from "../components/ui/TagChip.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import { getPost, getPosts } from "../functions/content.js";
import { useLang, useT } from "../functions/i18n.js";
import NotFound from "./NotFound.jsx";

export default function PostDetail() {
  const lang = useLang();
  const t = useT();
  const { slug } = useParams();
  const post = getPost(lang, slug);
  if (!post) return <NotFound />;

  const list = getPosts(lang);
  const i = list.findIndex((p) => p.slug === slug);
  const newer = list[i - 1];
  const older = list[i + 1];

  return (
    <PageFrame title={post.title} description={post.summary} width="narrow">
      <Link to={`/${lang}/blog`} className="text-sm text-muted hover:text-fg">
        ← {t.detail.back}
      </Link>
      <p className="mt-6 font-mono text-xs text-muted">{post.date}</p>
      <h1 className="mt-1 text-3xl font-medium">{post.title}</h1>
      {post.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
      )}
      <article className="mt-8">
        <Markdown>{post.body}</Markdown>
      </article>
      <nav className="mt-12 flex justify-between gap-4 border-t border-line pt-6 text-sm">
        {newer ? (
          <Link to={`/${lang}/blog/${newer.slug}`} className="text-muted hover:text-fg">
            ← {newer.title}
          </Link>
        ) : (
          <span />
        )}
        {older && (
          <Link to={`/${lang}/blog/${older.slug}`} className="text-right text-muted hover:text-fg">
            {older.title} →
          </Link>
        )}
      </nav>
    </PageFrame>
  );
}
