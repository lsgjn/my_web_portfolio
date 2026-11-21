import { Link } from "react-router";
import { withBase } from "../../functions/url.js";

const styles = {
  primary: "bg-accent text-bg hover:opacity-90",
  ghost: "border border-line text-fg hover:border-muted",
};

export default function Button({ to, href, variant = "primary", className = "", children, target, rel, ...rest }) {
  const cls = `inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition ${styles[variant]} ${className}`;
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>;
  return (
    <a
      href={withBase(href)}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : rel}
      className={cls}
      {...rest}
    >
      {children}
    </a>
  );
}
