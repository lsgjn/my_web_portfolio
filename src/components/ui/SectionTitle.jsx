import { Link } from "react-router";

export default function SectionTitle({ children, to, linkLabel }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted">{children}</h2>
      {to && (
        <Link to={to} className="text-sm text-accent hover:underline">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
