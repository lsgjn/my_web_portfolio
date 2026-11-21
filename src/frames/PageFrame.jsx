/**
 * 페이지 틀: 문서 제목/설명(SEO), 제목(h1), 본문 너비를 담당.
 * 속성:
 *  - title        브라우저 탭 제목
 *  - description  검색/공유용 설명 (선택)
 *  - heading      화면에 보이는 h1 (선택)
 *  - width        "default" | "narrow"(읽기용 720px)
 */
export default function PageFrame({ title, description, heading, width = "default", children }) {
  const widthClass = width === "narrow" ? "mx-auto max-w-[720px]" : "";
  return (
    <div className={widthClass}>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {heading && <h1 className="mb-6 text-3xl font-medium">{heading}</h1>}
      {children}
    </div>
  );
}
