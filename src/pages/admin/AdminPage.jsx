import { useCallback, useEffect, useState } from "react";
import ItemEditor from "../../components/admin/ItemEditor.jsx";
import ItemList from "../../components/admin/ItemList.jsx";
import SiteDataPanel from "../../components/admin/SiteDataPanel.jsx";
import AdminFrame from "../../frames/AdminFrame.jsx";
import { listItems } from "../../functions/admin-api.js";

const KINDS = [
  { id: "posts", label: "블로그 글", newLabel: "새 글 쓰기" },
  { id: "projects", label: "프로젝트", newLabel: "새 프로젝트" },
  { id: "site", label: "프로필 · 이력" },
];

// 개발 서버에서만 라우트에 연결되는 관리자 페이지 (배포 빌드에는 포함되지 않음)
export default function AdminPage() {
  const [kind, setKind] = useState("posts");
  const [items, setItems] = useState([]);
  const [target, setTarget] = useState(null); // null = 새 항목
  const [error, setError] = useState(null);

  const isSite = kind === "site";

  const refresh = useCallback(() => {
    if (kind === "site") return Promise.resolve();
    return listItems(kind)
      .then((list) => {
        setItems(list);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [kind]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const current = KINDS.find((k) => k.id === kind);

  return (
    <AdminFrame>
      <div className="mb-6 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => {
              setKind(k.id);
              setTarget(null);
            }}
            className={`rounded-lg border px-4 py-1.5 text-sm ${
              kind === k.id ? "border-accent text-accent" : "border-line text-muted hover:text-fg"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-300">{error}</p>}

      {isSite ? (
        <SiteDataPanel />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside>
            <ItemList
              items={items}
              selected={target}
              newLabel={current.newLabel}
              onNew={() => setTarget(null)}
              onSelect={(it) => setTarget({ lang: it.lang, slug: it.slug })}
            />
          </aside>
          <section>
            <h1 className="mb-5 text-xl font-medium">{target ? `${current.label} 수정` : current.newLabel}</h1>
            <ItemEditor
              key={`${kind}/${target?.lang ?? "new"}/${target?.slug ?? ""}`}
              kind={kind}
              target={target}
              onSaved={(t) => {
                refresh();
                setTarget(t);
              }}
              onDeleted={() => {
                refresh();
                setTarget(null);
              }}
            />
          </section>
        </div>
      )}
    </AdminFrame>
  );
}
