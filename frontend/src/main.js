import { createApp } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "./style.css";
import App from "./App.vue";
import router from "./router";

dayjs.locale("fr");

// Umami analytics (enabled when VITE_UMAMI_WEBSITE_ID is set at build time)
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
if (umamiWebsiteId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://stats.mathis-lamotte.fr/script.js";
  script.dataset.websiteId = umamiWebsiteId;
  document.head.appendChild(script);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .catch((err) => console.error("Service worker registration failed:", err));
}

createApp(App).use(router).mount("#app");
