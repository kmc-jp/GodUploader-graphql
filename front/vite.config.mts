/// <reference types="vitest/config" />
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRouter(),
    nodePolyfills({ protocolImports: true }),
    relay,
    {
      // vite-plugin-node-polyfills が config フックでグローバルに設定するエイリアス
      // (stream → stream-browserify 等) は SSR 環境でも適用されてしまう。
      // stream-browserify は CJS 形式のため ESM の SSR モジュールランナーで
      // `module is not defined` エラーになる。
      // enforce: 'pre' でエイリアス解決より先に実行し、SSR では Node.js
      // のネイティブモジュールを使うよう外部化する。
      name: "ssr-native-builtins",
      enforce: "pre",
      resolveId(id: string) {
        if (this.environment?.name !== "client") {
          const nodeBuiltins = [
            "assert",
            "buffer",
            "crypto",
            "events",
            "http",
            "https",
            "net",
            "os",
            "path",
            "querystring",
            "stream",
            "tls",
            "url",
            "util",
            "zlib",
          ];
          if (nodeBuiltins.includes(id) || id.startsWith("node:")) {
            return { id, external: true };
          }
        }
      },
    },
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
