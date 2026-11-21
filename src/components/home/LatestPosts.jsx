import SectionFrame from "../../frames/SectionFrame.jsx";
import { getPosts } from "../../functions/content.js";
import { useLang, useT } from "../../functions/i18n.js";
import PostItem from "../blog/PostItem.jsx";
import EmptyState from "../ui/EmptyState.jsx";

export default function LatestPosts() {
  const lang = useLang();
  const t = useT();
  const posts = getPosts(lang).slice(0, 3);
  return (
    <SectionFrame title={t.home.latest} to={`/${lang}/blog`} linkLabel={t.home.viewAll}>
      {posts.length ? (
        <ul>
          {posts.map((p) => (
            <PostItem key={p.slug} post={p} />
          ))}
        </ul>
      ) : (
        <EmptyState>{t.blog.empty}</EmptyState>
      )}
    </SectionFrame>
  );
}
