import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import relay from "vite-plugin-relay";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({ protocolImports: true }), relay],
  // workaround
  define: {
    global: "window",
    process: undefined,
    "process.env": (() => {
      return {};
    })(),
  },
  resolve: {
    alias: {
      // workaround: https://github.com/danbovey/react-infinite-scroller/issues/253
      "react-infinite-scroller": "react-infinite-scroller/index.js",
    },
  },
});
