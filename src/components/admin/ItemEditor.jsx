import { useEffect, useRef, useState } from "react";
import { deleteItem, getItem, saveItem, uploadFile } from "../../functions/admin-api.js";
import {
  IMAGE_RE,
  VIDEO_RE,
  attributesToForm,
  emptyForm,
  formToAttributes,
  insertAtCursor,
  slugify,
} from "../../functions/admin-helpers.js";
import Markdown from "../blog/Markdown.jsx";
import DropZone from "./DropZone.jsx";
import MediaList from "./MediaList.jsx";
import { Field, inputClass as input } from "./fields.jsx";

/**
 * 프로젝트/글 하나를 작성·수정하는 에디터.
 * 속성: kind("projects"|"posts"), target({lang, slug} | null=새 항목), onSaved(), onDeleted()
 * 이 컴포넌트는 key={kind/lang/slug}로 마운트해 항목이 바뀔 때마다 초기화한다.
 */
export default function ItemEditor({ kind, target, onSaved, onDeleted }) {
  const isNew = !target;
  const isProject = kind === "projects";
  const [lang, setLang] = useState(target?.lang ?? "ko");
  const [slug, setSlug] = useState(target?.slug ?? "");
  const [form, setForm] = useState(() => emptyForm(kind));
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // {type:'ok'|'error', text}
  const [preview, setPreview] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    let cancelled = false;
    getItem(kind, target.lang, target.slug)
      .then((d) => {
        if (cancelled) return;
        setForm(attributesToForm(kind, d.attributes));
        setBody(d.body.trim());
      })
      .catch((e) => !cancelled && setMessage({ type: "error", text: e.message }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [kind, target]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const text = (k) => ({ value: form[k], onChange: (e) => set(k, e.target.value), className: input });

  // 파일 업로드 → [{url, name}] (slug가 폴더명이 된다)
  async function upload(files) {
    if (!slug) {
      setMessage({ type: "error", text: "먼저 slug를 입력하세요. 첨부 파일이 slug 폴더에 저장됩니다." });
      return [];
    }
    setBusy(true);
    setMessage(null);
    const done = [];
    try {
      for (const file of files) done.push(await uploadFile(slug, file));
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
    return done;
  }

  // 본문에 드롭: 이미지/영상은 마크다운으로 커서 위치에 삽입, 그 외(pdf)는 링크
  async function dropIntoBody(files) {
    const uploaded = await upload(files);
    if (!uploaded.length) return;
    const snippet = uploaded
      .map((u) =>
        IMAGE_RE.test(u.name) || VIDEO_RE.test(u.name) ? `\n\n![${u.name}](${u.url})\n\n` : `\n\n[${u.name}](${u.url})\n\n`,
      )
      .join("");
    const { next, caret } = insertAtCursor(bodyRef.current, body, snippet);
    setBody(next);
    requestAnimationFrame(() => bodyRef.current?.setSelectionRange(caret, caret));
  }

  // 프로젝트 미디어 영역에 드롭
  async function dropIntoMedia(files) {
    const uploaded = await upload(files.filter((f) => IMAGE_RE.test(f.name) || VIDEO_RE.test(f.name)));
    if (!uploaded.length) return;
    const added = uploaded.map((u) => ({ type: VIDEO_RE.test(u.name) ? "video" : "image", src: u.url }));
    setForm((f) => ({
      ...f,
      media: [...f.media, ...added],
      thumbnail: f.thumbnail || added.find((m) => m.type === "image")?.src || "",
    }));
  }

  async function save() {
    if (!form.title.trim()) return setMessage({ type: "error", text: "제목을 입력하세요." });
    if (!slug) return setMessage({ type: "error", text: "slug를 입력하세요." });
    setBusy(true);
    setMessage(null);
    try {
      await saveItem({ kind, lang, slug, attributes: formToAttributes(kind, form), body, create: isNew });
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 바로 반영됩니다." });
      onSaved({ lang, slug });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`"${form.title || slug}" 을(를) 삭제할까요? 되돌릴 수 없습니다.\n(첨부한 파일은 public/media에 남습니다.)`)) return;
    setBusy(true);
    try {
      await deleteItem(kind, lang, slug);
      onDeleted();
    } catch (e) {
      setMessage({ type: "error", text: e.message });
      setBusy(false);
    }
  }

  if (loading) return <p className="text-sm text-muted">불러오는 중…</p>;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
        <Field label="언어">
          <select value={lang} onChange={(e) => setLang(e.target.value)} disabled={!isNew} className={input}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </Field>
        <Field label="slug" hint="주소와 첨부 폴더 이름 (영문 소문자·숫자·하이픈)">
          <div className="flex gap-2">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              disabled={!isNew}
              placeholder="my-first-game"
              className={input}
            />
            {isNew && (
              <button
                type="button"
                onClick={() => setSlug(slugify(form.title))}
                className="shrink-0 rounded-lg border border-line px-3 text-xs text-muted hover:text-fg"
              >
                제목에서 만들기
              </button>
            )}
          </div>
        </Field>
      </div>

      <Field label="제목">
        <input {...text("title")} placeholder="제목" />
      </Field>
      <Field label="요약">
        <input {...text("summary")} placeholder="한 줄 요약" />
      </Field>

      {isProject ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="기간">
              <input {...text("period")} placeholder="2026.03 – 2026.06" />
            </Field>
            <Field label="역할">
              <input {...text("role")} placeholder="클라이언트 개발" />
            </Field>
            <Field label="인원">
              <input {...text("team")} placeholder="1인" />
            </Field>
            <Field label="플랫폼">
              <input {...text("platform")} placeholder="PC / Mobile / Web" />
            </Field>
          </div>
          <Field label="기술 스택" hint="쉼표로 구분">
            <input {...text("stack")} placeholder="Unity, C#" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GitHub 링크">
              <input {...text("github")} placeholder="https://github.com/..." />
            </Field>
            <Field label="데모/플레이 링크">
              <input {...text("demo")} placeholder="https://..." />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
              대표 프로젝트(홈에 표시)
            </label>
            <label className="flex items-center gap-2 text-sm">
              정렬 순서
              <input
                type="number"
                value={form.order}
                onChange={(e) => set("order", e.target.value)}
                className={`${input} w-20`}
              />
            </label>
          </div>
          <div>
            <span className="mb-1 block font-mono text-xs text-muted">미디어 (이미지·영상)</span>
            <DropZone onFiles={dropIntoMedia} label="이미지/영상을 여기로 끌어다 놓으세요" />
            <MediaList
              media={form.media}
              thumbnail={form.thumbnail}
              onChange={(m) => set("media", m)}
              onThumbnail={(s) => set("thumbnail", s)}
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="날짜">
              <input type="date" {...text("date")} />
            </Field>
            <Field label="태그" hint="쉼표로 구분">
              <input {...text("tags")} placeholder="일상, 유니티" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="관련 프로젝트 slug" hint="선택">
              <input {...text("project")} placeholder="portfolio-site" />
            </Field>
            <label className="flex items-center gap-2 self-end pb-2 text-sm">
              <input type="checkbox" checked={form.draft} onChange={(e) => set("draft", e.target.checked)} />
              초안 (배포 시 숨김)
            </label>
          </div>
        </>
      )}

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="font-mono text-xs text-muted">본문 (마크다운) — 이미지·영상을 끌어다 놓으면 삽입됩니다</span>
          <button type="button" onClick={() => setPreview((v) => !v)} className="text-xs text-accent hover:underline">
            {preview ? "편집" : "미리보기"}
          </button>
        </div>
        {preview ? (
          <div className="min-h-[320px] rounded-lg border border-line bg-surface p-4">
            <Markdown>{body || "_내용이 없습니다._"}</Markdown>
          </div>
        ) : (
          <DropZone compact onFiles={dropIntoBody}>
            <textarea
              ref={bodyRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className={`${input} font-mono`}
              placeholder={"## 개요\n\n내용을 작성하세요."}
            />
          </DropZone>
        )}
      </div>

      {message && (
        <p
          role="status"
          className={`rounded-lg border px-3 py-2 text-sm ${
            message.type === "ok" ? "border-accent text-accent" : "border-red-400/60 text-red-300"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-line pt-4">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "처리 중…" : "저장"}
        </button>
        {!isNew && (
          <button type="button" onClick={remove} disabled={busy} className="text-sm text-red-300 hover:underline">
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
