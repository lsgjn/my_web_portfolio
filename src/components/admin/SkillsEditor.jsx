import { useState } from "react";
import { splitList } from "../../functions/admin-helpers.js";
import { Field, SaveButton, SmallButton, inputClass } from "./fields.jsx";

/**
 * 기술 스택 카테고리 편집 (한/영 공용). 항목은 쉼표로 구분.
 * 속성: value([{category, items[]}]), onSave, busy
 */
export default function SkillsEditor({ value, onSave, busy }) {
  const [groups, setGroups] = useState(() => value.map((g) => ({ category: g.category, items: g.items.join(", ") })));

  const update = (i, k, v) => setGroups((l) => l.map((g, j) => (j === i ? { ...g, [k]: v } : g)));

  return (
    <div className="space-y-3">
      {groups.map((g, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-[180px_1fr_auto] sm:items-end">
          <Field label="카테고리">
            <input value={g.category} onChange={(e) => update(i, "category", e.target.value)} className={inputClass} />
          </Field>
          <Field label="기술" hint="쉼표로 구분">
            <input value={g.items} onChange={(e) => update(i, "items", e.target.value)} className={inputClass} />
          </Field>
          <SmallButton onClick={() => setGroups((l) => l.filter((_, j) => j !== i))}>삭제</SmallButton>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <SmallButton onClick={() => setGroups((l) => [...l, { category: "", items: "" }])}>+ 카테고리 추가</SmallButton>
        <SaveButton
          busy={busy}
          onClick={() =>
            onSave(
              groups
                .map((g) => ({ category: g.category.trim(), items: splitList(g.items) }))
                .filter((g) => g.category && g.items.length),
            )
          }
        />
      </div>
    </div>
  );
}
