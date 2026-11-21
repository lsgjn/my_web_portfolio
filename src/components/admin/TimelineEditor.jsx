import { useState } from "react";
import { Field, SaveButton, SmallButton, inputClass } from "./fields.jsx";

const TYPES = [
  ["education", "학력"],
  ["activity", "활동"],
  ["award", "수상"],
  ["certificate", "자격증"],
  ["career", "경력"],
];

/**
 * 이력(학력·활동·수상 등) 타임라인 편집. 위/아래로 순서를 바꾼다.
 * 속성: value(배열), onSave(배열), busy
 */
export default function TimelineEditor({ value, onSave, busy }) {
  const [items, setItems] = useState(value);

  const update = (i, k, v) => setItems((l) => l.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i, d) =>
    setItems((l) => {
      const n = [...l];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-line bg-surface p-4">
          <div className="grid gap-3 sm:grid-cols-[180px_1fr_130px]">
            <Field label="기간">
              <input
                value={it.period ?? ""}
                onChange={(e) => update(i, "period", e.target.value)}
                placeholder="2024.03 – 현재"
                className={inputClass}
              />
            </Field>
            <Field label="제목">
              <input value={it.title ?? ""} onChange={(e) => update(i, "title", e.target.value)} className={inputClass} />
            </Field>
            <Field label="종류">
              <select value={it.type ?? "activity"} onChange={(e) => update(i, "type", e.target.value)} className={inputClass}>
                {TYPES.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="설명">
            <input value={it.desc ?? ""} onChange={(e) => update(i, "desc", e.target.value)} className={inputClass} />
          </Field>
          <div className="flex gap-2">
            <SmallButton disabled={i === 0} onClick={() => move(i, -1)}>
              ↑ 위로
            </SmallButton>
            <SmallButton disabled={i === items.length - 1} onClick={() => move(i, 1)}>
              ↓ 아래로
            </SmallButton>
            <SmallButton onClick={() => setItems((l) => l.filter((_, j) => j !== i))}>삭제</SmallButton>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <SmallButton onClick={() => setItems((l) => [...l, { period: "", title: "", desc: "", type: "activity" }])}>
          + 항목 추가
        </SmallButton>
        <SaveButton busy={busy} onClick={() => onSave(items.filter((it) => (it.title ?? "").trim()))} />
      </div>
    </div>
  );
}
