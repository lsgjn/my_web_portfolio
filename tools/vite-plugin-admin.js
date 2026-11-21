// 로컬 전용 관리자 API (개발 서버에서만 동작, 배포 빌드에는 포함되지 않음)
//
// 보안 원칙
//  1) apply: "serve" → `vite build` 결과물에는 이 코드가 존재하지 않는다.
//  2) 요청 Host가 localhost/127.0.0.1/[::1]일 때만 허용 (DNS rebinding 방지)
//  3) 브라우저의 다른 사이트에서 오는 요청(Origin 불일치)과 커스텀 헤더 없는 요청 거부 (CSRF 방지)
//  4) slug/언어/확장자를 화이트리스트로 검증하고, 최종 경로가 허용 폴더 안인지 확인 (경로 탈출 방지)
import fs from "node:fs/promises";
import path from "node:path";
import fm from "front-matter";
import { dump } from "js-yaml";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src", "content");
const MEDIA = path.join(ROOT, "public", "media");

const KINDS = ["projects", "posts"];
const LANGS = ["ko", "en"];
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;
const MEDIA_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".mp4", ".webm", ".pdf"]);
const MAX_JSON = 2 * 1024 * 1024;
const MAX_UPLOAD = 50 * 1024 * 1024;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
};

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) {
        reject(new HttpError(413, "파일이 너무 큽니다."));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function guard(req) {
  const host = (req.headers.host ?? "").replace(/:\d+$/, "");
  if (!["localhost", "127.0.0.1", "[::1]"].includes(host)) throw new HttpError(403, "local only");
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) throw new HttpError(403, "bad origin");
  if (req.headers["x-admin"] !== "1") throw new HttpError(403, "missing header");
}

function check(kind, lang, slug) {
  if (!KINDS.includes(kind)) throw new HttpError(400, "잘못된 종류");
  if (!LANGS.includes(lang)) throw new HttpError(400, "잘못된 언어");
  if (!SLUG.test(slug ?? "")) throw new HttpError(400, "slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  const file = path.join(CONTENT, kind, lang, `${slug}.md`);
  if (!file.startsWith(path.join(CONTENT, kind) + path.sep)) throw new HttpError(400, "잘못된 경로");
  return file;
}

const toDate = (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v).slice(0, 10) : "");

const exists =(p) => fs.access(p).then(() => true, () => false);

function sanitizeName(name) {
  const ext = path.extname(String(name)).toLowerCase();
  if (!MEDIA_EXT.has(ext)) throw new HttpError(400, `허용되지 않는 파일 형식입니다 (${ext || "확장자 없음"}).`);
  const base = path
    .basename(String(name), path.extname(String(name)))
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}${ext}`;
}

// 프로필/이력/스킬 JSON 데이터 (src/content/data)
const DATA = {
  profile: { perLang: true, validate: (v) => isPlainObject(v) },
  timeline: { perLang: true, validate: (v) => Array.isArray(v) && v.every(isPlainObject) },
  skills: {
    perLang: false,
    validate: (v) =>
      Array.isArray(v) &&
      v.every((g) => isPlainObject(g) && typeof g.category === "string" && Array.isArray(g.items) && g.items.every((i) => typeof i === "string")),
  },
};

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function dataFile(name, lang) {
  const spec = DATA[name];
  if (!spec) throw new HttpError(400, "잘못된 데이터 이름");
  if (spec.perLang && !LANGS.includes(lang)) throw new HttpError(400, "잘못된 언어");
  return { spec, file: path.join(CONTENT, "data", spec.perLang ? `${name}.${lang}.json` : `${name}.json`) };
}

async function route(req, res, url) {
  const q = url.searchParams;
  const method = req.method;

  if (method === "GET" && url.pathname === "/list") {
    const kind = q.get("kind");
    if (!KINDS.includes(kind)) throw new HttpError(400, "잘못된 종류");
    const items = [];
    for (const lang of LANGS) {
      const dir = path.join(CONTENT, kind, lang);
      const files = (await fs.readdir(dir).catch(() => [])).filter((f) => f.endsWith(".md"));
      for (const f of files) {
        const { attributes } = fm(await fs.readFile(path.join(dir, f), "utf8"));
        items.push({
          lang,
          slug: f.slice(0, -3),
          title: attributes.title ?? f,
          date: toDate(attributes.date),
          draft: !!attributes.draft,
          featured: !!attributes.featured,
        });
      }
    }
    return send(res, 200, { items });
  }

  if (method === "GET" && url.pathname === "/item") {
    const file = check(q.get("kind"), q.get("lang"), q.get("slug"));
    const raw = await fs.readFile(file, "utf8").catch(() => {
      throw new HttpError(404, "없는 항목입니다.");
    });
    const { attributes, body } = fm(raw);
    const date = toDate(attributes.date);
    return send(res, 200, { attributes: { ...attributes, ...(date ? { date } : {}) }, body });
  }

  if (method === "PUT" && url.pathname === "/item") {
    const data = JSON.parse((await readBody(req, MAX_JSON)).toString("utf8"));
    const { kind, lang, slug, attributes, body, create } = data;
    const file = check(kind, lang, slug);
    if (typeof attributes !== "object" || attributes === null || Array.isArray(attributes))
      throw new HttpError(400, "attributes 형식 오류");
    if (typeof body !== "string") throw new HttpError(400, "body 형식 오류");
    if (create && (await exists(file))) throw new HttpError(409, "같은 slug의 항목이 이미 있습니다.");
    await fs.mkdir(path.dirname(file), { recursive: true });
    const front = dump(attributes, { lineWidth: -1, noRefs: true });
    await fs.writeFile(file, `---\n${front}---\n\n${body.trim()}\n`, "utf8");
    return send(res, 200, { ok: true });
  }

  if (method === "DELETE" && url.pathname === "/item") {
    const file = check(q.get("kind"), q.get("lang"), q.get("slug"));
    await fs.unlink(file).catch(() => {
      throw new HttpError(404, "없는 항목입니다.");
    });
    return send(res, 200, { ok: true });
  }

  if (method === "POST" && url.pathname === "/upload") {
    const folder = q.get("folder");
    if (!SLUG.test(folder ?? "")) throw new HttpError(400, "폴더(slug)가 올바르지 않습니다.");
    let name = sanitizeName(q.get("name"));
    const dir = path.join(MEDIA, folder);
    if (!dir.startsWith(MEDIA + path.sep)) throw new HttpError(400, "잘못된 경로");
    const data = await readBody(req, MAX_UPLOAD);
    if (!data.length) throw new HttpError(400, "빈 파일입니다.");
    await fs.mkdir(dir, { recursive: true });
    if (await exists(path.join(dir, name))) {
      const ext = path.extname(name);
      name = `${name.slice(0, -ext.length)}-${Date.now().toString(36)}${ext}`;
    }
    await fs.writeFile(path.join(dir, name), data);
    return send(res, 200, { url: `/media/${folder}/${name}`, name });
  }

  if (method === "GET" && url.pathname === "/data") {
    const { file } = dataFile(q.get("name"), q.get("lang"));
    const raw = await fs.readFile(file, "utf8").catch(() => {
      throw new HttpError(404, "데이터 파일이 없습니다.");
    });
    return send(res, 200, { value: JSON.parse(raw) });
  }

  if (method === "PUT" && url.pathname === "/data") {
    const { name, lang, value } = JSON.parse((await readBody(req, MAX_JSON)).toString("utf8"));
    const { spec, file } = dataFile(name, lang);
    if (!spec.validate(value)) throw new HttpError(400, "데이터 형식이 올바르지 않습니다.");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    return send(res, 200, { ok: true });
  }

  throw new HttpError(404, "not found");
}

export default function adminPlugin() {
  return {
    name: "portfolio-admin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__admin", async (req, res) => {
        try {
          guard(req);
          await route(req, res, new URL(req.url, "http://localhost"));
        } catch (err) {
          const status = err instanceof HttpError ? err.status : err instanceof SyntaxError ? 400 : 500;
          send(res, status, { error: status === 500 ? "서버 오류" : err.message });
          if (status === 500) console.error("[admin]", err);
        }
      });
    },
  };
}
