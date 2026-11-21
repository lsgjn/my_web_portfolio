import { useRef, useState } from "react";

/**
 * 파일을 끌어다 놓거나(drag & drop) 버튼으로 선택하는 영역.
 * 속성: onFiles(files[]), label, compact(true면 children을 감싸기만 함)
 */
export default function DropZone({ onFiles, label, compact = false, children }) {
  const [over, setOver] = useState(false);
  const input = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const files = [...e.dataTransfer.files];
    if (files.length) onFiles(files);
  };

  const zoneProps = {
    onDragOver: (e) => {
      e.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: handleDrop,
  };

  if (compact) {
    return (
      <div {...zoneProps} className={`rounded-lg ${over ? "ring-2 ring-accent" : ""}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      {...zoneProps}
      className={`rounded-xl border border-dashed px-4 py-6 text-center text-sm ${
        over ? "border-accent bg-surface-2 text-fg" : "border-line text-muted"
      }`}
    >
      <p>{label}</p>
      <button
        type="button"
        onClick={() => input.current?.click()}
        className="mt-2 rounded-md border border-line px-3 py-1 text-xs hover:text-fg"
      >
        파일 선택
      </button>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          const files = [...e.target.files];
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}
