import { createApp } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import "./style.css";
import App from "./App.vue";
import router from "./router";

dayjs.locale("fr");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .catch((err) => console.error("Service worker registration failed:", err));
}

createApp(App).use(router).mount("#app");
