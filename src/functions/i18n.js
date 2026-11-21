import { useParams } from "react-router";

export const LANGS = ["ko", "en"];

const dict = {
  ko: {
    nav: { projects: "프로젝트", blog: "블로그", about: "소개", contact: "연락" },
    cta: { resume: "이력서 보기", hire: "프로젝트 문의" },
    home: {
      featured: "대표 프로젝트",
      skills: "기술 스택",
      latest: "최근 글",
      work: "함께 일하기",
      workIntro: "게임 클라이언트부터 서버, 웹까지 혼자 만들어 드립니다.",
      viewAll: "전체 보기",
    },
    projects: { title: "프로젝트", all: "전체", empty: "프로젝트를 준비 중입니다." },
    blog: { title: "블로그", all: "전체", empty: "첫 글을 준비 중입니다." },
    about: { title: "소개", timeline: "이력" },
    contact: { title: "연락", intro: "채용·프로젝트 문의는 아래로 연락주세요.", copy: "복사", copied: "복사됨" },
    detail: { period: "기간", role: "역할", team: "인원", stack: "기술", platform: "플랫폼", related: "관련 글", back: "목록으로", links: "링크" },
    notFilled: "아직 채우지 않음",
    notFound: { title: "페이지를 찾을 수 없습니다", home: "홈으로" },
    footer: "© " + new Date().getFullYear(),
  },
  en: {
    nav: { projects: "Projects", blog: "Blog", about: "About", contact: "Contact" },
    cta: { resume: "View resume", hire: "Hire me" },
    home: {
      featured: "Featured projects",
      skills: "Skills",
      latest: "Latest posts",
      work: "Work with me",
      workIntro: "I build games from client to server to web, solo.",
      viewAll: "View all",
    },
    projects: { title: "Projects", all: "All", empty: "Projects coming soon." },
    blog: { title: "Blog", all: "All", empty: "First post coming soon." },
    about: { title: "About", timeline: "Timeline" },
    contact: { title: "Contact", intro: "For hiring or project inquiries, reach out below.", copy: "Copy", copied: "Copied" },
    detail: { period: "Period", role: "Role", team: "Team", stack: "Stack", platform: "Platform", related: "Related posts", back: "Back to list", links: "Links" },
    notFilled: "Not filled in yet",
    notFound: { title: "Page not found", home: "Go home" },
    footer: "© " + new Date().getFullYear(),
  },
};

export function useLang() {
  const { lang } = useParams();
  return LANGS.includes(lang) ? lang : "ko";
}

export function useT() {
  return dict[useLang()];
}
