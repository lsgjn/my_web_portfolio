import { Link, useParams } from "react-router";
import Markdown from "../components/blog/Markdown.jsx";
import PostItem from "../components/blog/PostItem.jsx";
import Button from "../components/ui/Button.jsx";
import MediaViewer from "../components/ui/MediaViewer.jsx";
import TagChip from "../components/ui/TagChip.jsx";
import PageFrame from "../frames/PageFrame.jsx";
import SectionFrame from "../frames/SectionFrame.jsx";
import { getPostsByProject, getProject } from "../functions/content.js";
import { useLang, useT } from "../functions/i18n.js";
import NotFound from "./NotFound.jsx";

export default function ProjectDetail() {
  const lang = useLang();
  const t = useT();
  const { slug } = useParams();
  const p = getProject(lang, slug);
  if (!p) return <NotFound />;

  const related = getPostsByProject(lang, slug);
  const meta = [
    [t.detail.period, p.period],
    [t.detail.role, p.role],
    [t.detail.team, p.team],
    [t.detail.platform, p.platform],
  ].filter(([, v]) => v);

  return (
    <PageFrame title={p.title} description={p.summary}>
      <Link to={`/${lang}/projects`} className="text-sm text-muted hover:text-fg">
        ← {t.detail.back}
      </Link>
      <h1 className="mt-4 text-3xl font-medium">{p.title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{p.summary}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {p.links?.demo && (
          <Button href={p.links.demo} target="_blank">
            Demo
          </Button>
        )}
        {p.links?.github && (
          <Button href={p.links.github} target="_blank" variant="ghost">
            GitHub
          </Button>
        )}
      </div>

      <div className="mt-8">
        <MediaViewer media={p.media} title={p.title} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_260px]">
        <article>
          <Markdown>{p.body}</Markdown>
        </article>
        <aside className="h-fit space-y-4 rounded-xl border border-line bg-surface p-4 text-sm lg:order-last">
          {meta.map(([k, v]) => (
            <div key={k}>
              <p className="font-mono text-xs text-muted">{k}</p>
              <p>{v}</p>
            </div>
          ))}
          {p.stack?.length > 0 && (
            <div>
              <p className="mb-2 font-mono text-xs text-muted">{t.detail.stack}</p>
              <div className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <TagChip key={s}>{s}</TagChip>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <SectionFrame title={t.detail.related} spacing="mt-14">
          <ul>
            {related.map((post) => (
              <PostItem key={post.slug} post={post} />
            ))}
          </ul>
        </SectionFrame>
      )}
    </PageFrame>
  );
}
