/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

const collectReactAppEnv = () => {
  const reactAppEnv = Object.entries(process.env)
    .filter(([k]) => k.startsWith("REACT_APP_"))
    .map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]);
  return Object.fromEntries(reactAppEnv);
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true }), relay],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  define: {
    ...collectReactAppEnv(),
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
