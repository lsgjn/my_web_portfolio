import { withBase } from "../../functions/url.js";

export default function MediaViewer({ media = [], title }) {
  if (!media.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {media.map((m, i) => {
        const wide = media.length === 1 ? "sm:col-span-2" : "";
        const src = withBase(m.src);
        if (m.type === "video") {
          return <video key={i} src={src} controls className={`w-full rounded-xl ${wide}`} />;
        }
        if (m.type === "iframe") {
          return (
            <iframe
              key={i}
              src={src}
              title={m.alt || title}
              className="aspect-video w-full rounded-xl border border-line sm:col-span-2"
              allowFullScreen
            />
          );
        }
        return <img key={i} src={src} alt={m.alt || title} loading="lazy" className={`w-full rounded-xl ${wide}`} />;
      })}
    </div>
  );
}
