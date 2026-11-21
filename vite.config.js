import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import adminPlugin from "./tools/vite-plugin-admin.js";

// GitHub Pages: https://lsgjn.github.io/my_web_portfolio/ 하위 경로로 배포된다.
// 개발 서버(npm run dev)는 "/"를 그대로 사용한다.
const REPO_BASE = "/my_web_portfolio/";

export default defineConfig(({ command, isPreview }) => ({
  // build와 preview(빌드 결과 확인)는 하위 경로, 개발 서버만 "/"
  base: command === "build" || isPreview ? REPO_BASE : "/",
  plugins: [react(), tailwindcss(), adminPlugin()],
}));
