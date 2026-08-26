import { createApp } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "./style.css";
import App from "./App.vue";
import router from "./router";

dayjs.locale("fr");

// Umami analytics (production only)
const umamiWebsiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
if (import.meta.env.PROD && umamiWebsiteId) {
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
