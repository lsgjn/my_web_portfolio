// 관리자 화면에서 쓰는 순수 함수들 (폼 ↔ frontmatter 변환 등)

export const IMAGE_RE = /\.(png|jpe?g|gif|webp|svg)$/i;
export const VIDEO_RE = /\.(mp4|webm)$/i;

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const today = () => new Date().toISOString().slice(0, 10);

export const splitList = (s) =>
  String(s ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

// 입력 폼 상태 → 저장용 attributes (빈 값은 제거)
export function formToAttributes(kind, f) {
  const a = { title: f.title.trim() };
  const put = (k, v) => {
    if (v !== "" && v != null && !(Array.isArray(v) && !v.length)) a[k] = v;
  };
  put("summary", f.summary.trim());
  if (kind === "posts") {
    put("date", f.date);
    put("tags", splitList(f.tags));
    put("project", f.project.trim());
    if (f.draft) a.draft = true;
  } else {
    put("period", f.period.trim());
    put("role", f.role.trim());
    put("team", f.team.trim());
    put("platform", f.platform.trim());
    put("stack", splitList(f.stack));
    if (f.featured) a.featured = true;
    if (f.order !== "" && !Number.isNaN(Number(f.order))) a.order = Number(f.order);
    put("thumbnail", f.thumbnail);
    const links = {};
    if (f.github.trim()) links.github = f.github.trim();
    if (f.demo.trim()) links.demo = f.demo.trim();
    if (Object.keys(links).length) a.links = links;
    put("media", f.media);
  }
  return a;
}

// 저장된 attributes → 입력 폼 상태
export function attributesToForm(kind, a = {}) {
  const base = { title: a.title ?? "", summary: a.summary ?? "" };
  if (kind === "posts") {
    return {
      ...base,
      date: a.date ?? today(),
      tags: (a.tags ?? []).join(", "),
      project: a.project ?? "",
      draft: !!a.draft,
    };
  }
  return {
    ...base,
    period: a.period ?? "",
    role: a.role ?? "",
    team: a.team ?? "",
    platform: a.platform ?? "",
    stack: (a.stack ?? []).join(", "),
    featured: !!a.featured,
    order: a.order ?? "",
    thumbnail: a.thumbnail ?? "",
    github: a.links?.github ?? "",
    demo: a.links?.demo ?? "",
    media: a.media ?? [],
  };
}

export const emptyForm = (kind) => attributesToForm(kind, {});

// 커서 위치에 텍스트 삽입
export function insertAtCursor(textarea, value, text) {
  const start = textarea?.selectionStart ?? value.length;
  const end = textarea?.selectionEnd ?? value.length;
  return { next: value.slice(0, start) + text + value.slice(end), caret: start + text.length };
}
