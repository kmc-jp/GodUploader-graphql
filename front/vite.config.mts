/// <reference types="vitest/config" />
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ protocolImports: true }),
    relay,
    {
      name: "exclude-msw-from-build",
      apply: "build",
      closeBundle() {
        const distDir = path.resolve(__dirname, "dist");
        fs.rmSync(path.join(distDir, "mockServiceWorker.js"), { force: true });
        fs.rmSync(path.join(distDir, "mocks"), {
          recursive: true,
          force: true,
        });
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
    setupFiles: ["./src/test/setup.ts"],
  },
});
