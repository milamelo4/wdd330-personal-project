import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        login: resolve(__dirname, "src/login/index.html"),
        json: resolve(__dirname, "src/json/emotions.json"),
        cycle: resolve(__dirname, "src/cycleData/index.html")
        
       
      },
    },
  },
});
