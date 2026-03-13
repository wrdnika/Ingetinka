import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import i18n from "./plugins/i18n";
import "./style.css";
import * as LucideIcons from "lucide-vue-next";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("Versi baru tersedia. Muat ulang sekarang?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("Ingetinka siap digunakan secara offline.");
  },
});

const app = createApp(App);
app.use(router);
app.use(i18n);
Object.entries(LucideIcons).forEach(([key, component]) => {
  app.component(key, component);
});
app.mount("#app");
