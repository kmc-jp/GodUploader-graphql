import react from "@vitejs/plugin-react";
import relay from "vite-plugin-relay";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), relay],
  resolve: {
    alias: {
      "react-infinite-scroller": "react-infinite-scroller/index.js",
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
