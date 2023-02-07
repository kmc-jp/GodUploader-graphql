import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), relay],
  resolve: {
    alias: {
      "react-infinite-scroller": "react-infinite-scroller/index.js",
    },
  },
});
