export default function Timeline({ items }) {
  return (
    <ol className="border-l border-line">
      {items.map((it, i) => (
        <li key={i} className="relative pb-6 pl-6 last:pb-0">
          <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
          <p className="font-mono text-xs text-muted">{it.period}</p>
          <h3 className="font-medium">{it.title}</h3>
          {it.desc && <p className="text-sm text-muted">{it.desc}</p>}
        </li>
      ))}
    </ol>
  );
}
