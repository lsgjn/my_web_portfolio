import fm from "front-matter";

const projectFiles = import.meta.glob("/src/content/projects/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
const postFiles = import.meta.glob("/src/content/posts/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const toDateString = (v) =>
  v instanceof Date ? v.toISOString().slice(0, 10) : String(v ?? "");

function parse(files) {
  return Object.entries(files).map(([path, raw]) => {
    const [, lang, slug] = path.match(/\/(ko|en)\/([^/]+)\.md$/);
    const { attributes, body } = fm(raw);
    return { ...attributes, lang, slug, body, date: toDateString(attributes.date) };
  });
}

const allProjects = parse(projectFiles);
const allPosts = parse(postFiles).filter((p) => !(import.meta.env.PROD && p.draft));

export function getProjects(lang) {
  return allProjects
    .filter((p) => p.lang === lang)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getFeaturedProjects(lang, limit = 3) {
  return getProjects(lang)
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function getProject(lang, slug) {
  return allProjects.find((p) => p.lang === lang && p.slug === slug);
}

export function getPosts(lang) {
  return allPosts.filter((p) => p.lang === lang).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(lang, slug) {
  return allPosts.find((p) => p.lang === lang && p.slug === slug);
}

export function getPostsByProject(lang, projectSlug) {
  return getPosts(lang).filter((p) => p.project === projectSlug);
}
