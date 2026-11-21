// 관리자 폼 공용 조각
export const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-xs text-muted">
        {label}
        {hint && <span className="ml-2 normal-case text-muted/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function SaveButton({ busy, onClick, children = "저장" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
    >
      {busy ? "처리 중…" : children}
    </button>
  );
}

export function SmallButton({ onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-fg disabled:opacity-30"
    >
      {children}
    </button>
  );
}
