import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { withBase } from "../../functions/url.js";

const VIDEO = /\.(mp4|webm)$/i;

// 마크다운의 이미지 문법으로 영상도 삽입할 수 있게: ![설명](/media/x/clip.mp4)
const components = {
  img: ({ src, alt }) =>
    VIDEO.test(src ?? "") ? (
      <video src={withBase(src)} controls aria-label={alt} />
    ) : (
      <img src={withBase(src)} alt={alt ?? ""} loading="lazy" />
    ),
  a: ({ href, children }) => (
    <a href={withBase(href)} {...(/^https?:/.test(href ?? "") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  ),
};

// 원본 HTML은 렌더링하지 않는다(react-markdown 기본값). 내가 쓴 마크다운만 안전하게 표시.
export default function Markdown({ children }) {
  return (
    <div className="md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
