export default function TagChip({ children, active, onClick }) {
  const base = "rounded-md px-2 py-0.5 font-mono text-xs";
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={!!active}
        className={`${base} border transition ${
          active
            ? "border-accent text-accent"
            : "border-line bg-surface-2 text-muted hover:text-fg"
        }`}
      >
        {children}
      </button>
    );
  }
  return <span className={`${base} bg-surface-2 text-muted`}>{children}</span>;
}
