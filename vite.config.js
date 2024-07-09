import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // base: "/wdd330-personal-project/", // Correct base path
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login/index.html"),
        cycle: resolve(__dirname, "src/cycleData/index.html"),
        partials: resolve(__dirname, "src/partials/header.html")
      },
    },
  },
});
