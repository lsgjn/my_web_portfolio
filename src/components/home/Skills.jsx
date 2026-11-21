import SectionFrame from "../../frames/SectionFrame.jsx";
import { getSkills } from "../../functions/data.js";
import { useT } from "../../functions/i18n.js";
import TagChip from "../ui/TagChip.jsx";

export default function Skills() {
  const t = useT();
  return (
    <SectionFrame title={t.home.skills}>
      <div className="grid gap-4 sm:grid-cols-2">
        {getSkills().map((g) => (
          <div key={g.category} className="rounded-xl border border-line bg-surface p-4">
            <h3 className="mb-3 font-mono text-xs text-muted">{g.category}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((i) => (
                <TagChip key={i}>{i}</TagChip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
