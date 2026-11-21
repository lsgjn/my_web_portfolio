import { useState } from "react";
import { uploadFile } from "../../functions/admin-api.js";
import DropZone from "./DropZone.jsx";
import { Field, SaveButton, SmallButton, inputClass } from "./fields.jsx";

const lines = (s) =>
  String(s)
    .split("\n")
    .map((v) => v.trim())
    .filter(Boolean);

/**
 * 프로필(이름, 소개, 연락처, 이력서, 강점, 제공 서비스) 편집.
 * 속성: value(저장된 객체), onSave(객체), busy
 */
export default function ProfileEditor({ value, onSave, busy }) {
  const [f, setF] = useState({
    name: value.name ?? "",
    label: value.label ?? "",
    headline: value.headline ?? "",
    intro: value.intro ?? "",
    email: value.email ?? "",
    github: value.github ?? "",
    resume: value.resume ?? "",
    about: (value.about ?? []).join("\n\n"),
    services: (value.services ?? []).join("\n"),
  });
  const [strengths, setStrengths] = useState(value.strengths ?? []);
  const [uploadMsg, setUploadMsg] = useState(null);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const text = (k) => ({ value: f[k], onChange: set(k), className: inputClass });

  async function dropResume(files) {
    const pdf = files.find((x) => /\.pdf$/i.test(x.name));
    if (!pdf) return setUploadMsg("PDF 파일만 올릴 수 있습니다.");
    try {
      const { url } = await uploadFile("resume", pdf);
      setF((p) => ({ ...p, resume: url }));
      setUploadMsg(null);
    } catch (e) {
      setUploadMsg(e.message);
    }
  }

  const setStrength = (i, k, v) => setStrengths((list) => list.map((s, j) => (j === i ? { ...s, [k]: v } : s)));

  function submit() {
    onSave({
      ...value,
      name: f.name.trim(),
      label: f.label.trim(),
      headline: f.headline,
      intro: f.intro.trim(),
      email: f.email.trim(),
      github: f.github.trim(),
      resume: f.resume.trim(),
      about: f.about
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      strengths: strengths.filter((s) => s.title.trim() || s.desc.trim()),
      services: lines(f.services),
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이름">
          <input {...text("name")} />
        </Field>
        <Field label="직군 라벨" hint="Hero 위 작은 글자">
          <input {...text("label")} />
        </Field>
      </div>
      <Field label="헤드라인" hint="줄바꿈 가능">
        <textarea rows={3} {...text("headline")} />
      </Field>
      <Field label="한 줄 소개">
        <input {...text("intro")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="이메일">
          <input type="email" {...text("email")} />
        </Field>
        <Field label="GitHub 주소">
          <input {...text("github")} />
        </Field>
      </div>

      <div>
        <span className="mb-1 block font-mono text-xs text-muted">이력서 PDF</span>
        <DropZone onFiles={dropResume} label="PDF를 끌어다 놓으세요" />
        <p className="mt-2 font-mono text-xs text-muted">현재: {f.resume || "없음"}</p>
        {uploadMsg && <p className="mt-1 text-xs text-red-300">{uploadMsg}</p>}
      </div>

      <Field label="자기소개" hint="문단은 빈 줄로 구분">
        <textarea rows={8} {...text("about")} />
      </Field>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-xs text-muted">강점</span>
          <SmallButton onClick={() => setStrengths((l) => [...l, { title: "", desc: "" }])}>+ 추가</SmallButton>
        </div>
        <div className="space-y-2">
          {strengths.map((s, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[200px_1fr_auto]">
              <input
                value={s.title}
                onChange={(e) => setStrength(i, "title", e.target.value)}
                placeholder="제목"
                className={inputClass}
              />
              <input
                value={s.desc}
                onChange={(e) => setStrength(i, "desc", e.target.value)}
                placeholder="설명"
                className={inputClass}
              />
              <SmallButton onClick={() => setStrengths((l) => l.filter((_, j) => j !== i))}>삭제</SmallButton>
            </div>
          ))}
        </div>
      </div>

      <Field label="함께 일하기 — 제공 서비스" hint="한 줄에 하나">
        <textarea rows={4} {...text("services")} />
      </Field>

      <SaveButton busy={busy} onClick={submit} />
    </div>
  );
}
