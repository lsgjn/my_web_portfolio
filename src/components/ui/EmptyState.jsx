export default function EmptyState({ children }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
      {children}
    </p>
  );
}
