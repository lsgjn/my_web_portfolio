import SectionTitle from "../components/ui/SectionTitle.jsx";

/**
 * 섹션 틀: 위아래 간격 + 섹션 제목 + (선택) 전체 보기 링크.
 * 속성:
 *  - title      섹션 제목
 *  - to / linkLabel  우측 링크 (선택)
 *  - spacing    섹션 간격 클래스 (기본 py-12)
 */
export default function SectionFrame({ title, to, linkLabel, spacing = "py-12", children }) {
  return (
    <section className={spacing}>
      {title && (
        <SectionTitle to={to} linkLabel={linkLabel}>
          {title}
        </SectionTitle>
      )}
      {children}
    </section>
  );
}
