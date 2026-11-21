import { Link } from "react-router";

export default function NotFound({ bare }) {
  const lang = navigator.language?.toLowerCase().startsWith("ko") ? "ko" : "en";
  const text = lang === "ko" ? ["페이지를 찾을 수 없습니다", "홈으로"] : ["Page not found", "Go home"];
  return (
    <div className={`px-4 py-24 text-center ${bare ? "min-h-screen" : ""}`}>
      <title>404</title>
      <p className="font-mono text-accent">404</p>
      <h1 className="mt-2 text-2xl font-medium">{text[0]}</h1>
      <Link to={`/${lang}`} className="mt-6 inline-block text-sm text-accent hover:underline">
        {text[1]}
      </Link>
    </div>
  );
}
