import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Ingetinka - Reminder App",
        short_name: "Ingetinka",
        description: "Minimalist Reminder App with PWA support",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "wrdnika-192.PNG",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "wrdnika-512.PNG",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "wrdnika-512.PNG",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
