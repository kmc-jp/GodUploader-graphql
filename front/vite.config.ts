/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true }), relay],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  define: {
    "process.env": (() => {
      const reactAppEnv = Object.entries(process.env).filter(([k]) =>
        k.startsWith("REACT_APP_")
      );
      return Object.fromEntries(reactAppEnv);
    })(),
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
