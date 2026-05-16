/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    {
      // nodePolyfills はブラウザ向けポリフィルのため、SSR環境では除外する
      // (stream-browserify 等の CJS モジュールが ESM 環境で実行されると
      //  `module is not defined` エラーになるため)
      ...nodePolyfills({ protocolImports: true }),
      applyToEnvironment(env: { name: string }) {
        return env.name === "client";
      },
    },
    relay,
  ],
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
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
