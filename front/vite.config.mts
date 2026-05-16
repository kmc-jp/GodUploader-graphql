import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

export default defineConfig({
  plugins: [reactRouter(), nodePolyfills({ protocolImports: true }), relay],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  resolve: {
    alias: {
      // workaround: https://github.com/danbovey/react-infinite-scroller/issues/253
      "react-infinite-scroller": "react-infinite-scroller/index.js",
    },
  },
  // SPA モード (ssr: false) でも build/client/index.html を生成するために
  // 一度サーバ向けバンドルを通すので、CJS の依存パッケージを ESM に変換しておく
  ssr: {
    // SPA mode の事前レンダリング時、CJS の依存パッケージは
    // Node ESM の named import で読めないため ESM 化してインライン化する。
    // `bootstrap` は browser-only (document に触る) のため動的 import に留め、
    // ここには含めない。
    noExternal: [
      "react-relay",
      "react-helmet",
      "relay-runtime",
      "react-string-replace",
      "react-infinite-scroller",
      "clsx",
      /^react-konva/,
      /^@dnd-kit\//,
    ],
  },
});
