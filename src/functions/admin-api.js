// 관리자 화면 → 로컬 개발 서버(/__admin) 호출 함수. 개발 모드에서만 import 된다.
const BASE = "/__admin";
const HEADERS = { "X-Admin": "1" };

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...HEADERS, ...options.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `요청 실패 (${res.status})`);
  return data;
}

const qs = (o) => new URLSearchParams(o).toString();

export const listItems = (kind) => request(`/list?${qs({ kind })}`).then((d) => d.items);

export const getItem = (kind, lang, slug) => request(`/item?${qs({ kind, lang, slug })}`);

export const saveItem = ({ kind, lang, slug, attributes, body, create }) =>
  request("/item", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, lang, slug, attributes, body, create }),
  });

export const deleteItem = (kind, lang, slug) =>
  request(`/item?${qs({ kind, lang, slug })}`, { method: "DELETE" });

export const getData = (name, lang = "") => request(`/data?${qs({ name, lang })}`).then((d) => d.value);

export const saveData = (name, lang, value) =>
  request("/data", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, lang, value }),
  });

export const uploadFile = (folder, file) =>
  request(`/upload?${qs({ folder, name: file.name })}`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: file,
  });
