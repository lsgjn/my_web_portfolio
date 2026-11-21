// "/media/..." 처럼 사이트 루트 기준으로 적은 경로에 배포 base를 붙인다.
// 외부 주소(https://...), 상대 경로, 빈 값은 그대로 둔다.
export function withBase(url) {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) return url;
  return import.meta.env.BASE_URL.replace(/\/$/, "") + url;
}
