/**
 * 작성된 항목 목록. 속성: items, selected({lang,slug}), onSelect(item), onNew()
 */
export default function ItemList({ items, selected, onSelect, onNew, newLabel }) {
  return (
    <div>
      <button
        type="button"
        onClick={onNew}
        className="mb-3 w-full rounded-lg bg-accent px-3 py-2 text-sm font-medium text-bg hover:opacity-90"
      >
        + {newLabel}
      </button>
      {items.length === 0 && <p className="py-6 text-center text-sm text-muted">아직 없습니다.</p>}
      <ul className="space-y-1">
        {items.map((it) => {
          const active = selected && selected.lang === it.lang && selected.slug === it.slug;
          return (
            <li key={`${it.lang}/${it.slug}`}>
              <button
                type="button"
                onClick={() => onSelect(it)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  active ? "border-accent bg-surface-2" : "border-line hover:bg-surface"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="rounded bg-surface-2 px-1.5 font-mono text-[11px] text-muted">
                    {it.lang.toUpperCase()}
                  </span>
                  {it.draft && <span className="font-mono text-[11px] text-accent">draft</span>}
                  {it.featured && <span className="font-mono text-[11px] text-accent">★</span>}
                </span>
                <span className="mt-1 block truncate">{it.title}</span>
                <span className="block truncate font-mono text-[11px] text-muted">
                  {it.slug}
                  {it.date && ` · ${it.date}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
