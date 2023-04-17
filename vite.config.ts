import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import copy from "rollup-plugin-copy";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [
        copy({
          hook: "writeBundle",
          targets: [
            { src: "./manifest.json", dest: "./dist/" },
            { src: "./DESCRIPTION.md", dest: "./dist/" },
            { src: "./SETUP.md", dest: "./dist/" },
            { src: "./icon.svg", dest: "./dist/" },
            { src: "./docs", dest: "./dist/" },
          ],
        }),
      ],
      external: [
        "flatpickr/dist/themes/light.css",
        "tippy.js/dist/tippy.css",
        "simplebar/dist/simplebar.min.css",
        "@deskpro/deskpro-ui/dist/deskpro-ui.css",
        "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css",
        "react-resize-observer",
      ],
    },
  },
});
