import { useState } from "react";
import DataLoader from "./DataLoader.jsx";
import ProfileEditor from "./ProfileEditor.jsx";
import SkillsEditor from "./SkillsEditor.jsx";
import TimelineEditor from "./TimelineEditor.jsx";
import { inputClass } from "./fields.jsx";

const SECTIONS = [
  { id: "profile", label: "프로필", perLang: true, Editor: ProfileEditor },
  { id: "timeline", label: "이력", perLang: true, Editor: TimelineEditor },
  { id: "skills", label: "기술 스택", perLang: false, Editor: SkillsEditor },
];

/** 프로필 · 이력 · 기술 스택 편집 패널 */
export default function SiteDataPanel() {
  const [sectionId, setSectionId] = useState("profile");
  const [lang, setLang] = useState("ko");
  const section = SECTIONS.find((s) => s.id === sectionId);
  const { Editor } = section;

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSectionId(s.id)}
            className={`rounded-lg border px-3 py-1 text-sm ${
              sectionId === s.id ? "border-accent text-accent" : "border-line text-muted hover:text-fg"
            }`}
          >
            {s.label}
          </button>
        ))}
        {section.perLang ? (
          <select value={lang} onChange={(e) => setLang(e.target.value)} className={`${inputClass} !w-32`} aria-label="언어">
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        ) : (
          <span className="text-xs text-muted">한/영 공용</span>
        )}
      </div>
      <DataLoader key={`${sectionId}/${section.perLang ? lang : ""}`} name={sectionId} lang={section.perLang ? lang : ""}>
        {({ value, save, busy }) => <Editor value={value} busy={busy} onSave={save} />}
      </DataLoader>
    </div>
  );
}
