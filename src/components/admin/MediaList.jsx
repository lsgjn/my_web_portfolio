import { IMAGE_RE } from "../../functions/admin-helpers.js";

/**
 * 프로젝트에 첨부된 미디어 목록 (썸네일 지정/삭제).
 * 속성: media[], thumbnail, onChange(media), onThumbnail(src)
 */
export default function MediaList({ media, thumbnail, onChange, onThumbnail }) {
  if (!media.length) return null;
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {media.map((m, i) => (
        <li key={m.src} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2">
          {m.type === "video" ? (
            <video src={m.src} className="h-14 w-20 rounded object-cover" muted />
          ) : (
            <img src={m.src} alt="" className="h-14 w-20 rounded object-cover" />
          )}
          <div className="min-w-0 flex-1 text-xs">
            <p className="truncate font-mono text-muted">{m.src.split("/").pop()}</p>
            <div className="mt-1 flex gap-3">
              {IMAGE_RE.test(m.src) && (
                <button
                  type="button"
                  className={thumbnail === m.src ? "text-accent" : "text-muted hover:text-fg"}
                  onClick={() => onThumbnail(m.src)}
                >
                  {thumbnail === m.src ? "썸네일 ✓" : "썸네일로"}
                </button>
              )}
              <button
                type="button"
                className="text-muted hover:text-fg"
                onClick={() => onChange(media.filter((_, j) => j !== i))}
              >
                제거
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
