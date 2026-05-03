import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/femboy-clicker" : "./",
  server: {
    port: 3001,
  },
  build: {
    // disable this for low bundle sizes
    sourcemap: true,
    // broken? (npm run build only gives sprites)
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       kaplay: ["kaplay"],
    //     },
    //   },
    // },
  },
});
