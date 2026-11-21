import { useEffect, useState } from "react";
import { getData, saveData } from "../../functions/admin-api.js";

/**
 * JSON 데이터(profile/timeline/skills)를 불러오고 저장 상태를 관리한다.
 * 사용: <DataLoader name lang>{({ value, save, busy }) => <편집기 />}</DataLoader>
 */
export default function DataLoader({ name, lang, children }) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getData(name, lang)
      .then((v) => !cancelled && setValue(v))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [name, lang]);

  async function save(next) {
    setBusy(true);
    setMessage(null);
    try {
      await saveData(name, lang, next);
      setMessage({ type: "ok", text: "저장했습니다. 사이트에 바로 반영됩니다." });
    } catch (e) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setBusy(false);
    }
  }

  if (error) return <p className="text-sm text-red-300">{error}</p>;
  if (value === null) return <p className="text-sm text-muted">불러오는 중…</p>;

  return (
    <div className="space-y-4">
      {children({ value, save, busy })}
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
    </div>
  );
}
