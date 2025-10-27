import { createRouter, createWebHistory } from "vue-router";
import AppWrapper from "./AppWrapper.vue";
import SharedView from "./components/SharedView.vue";

const routes = [
  {
    path: "/",
    component: AppWrapper,
  },
  {
    path: "/shared/:userId",
    name: "SharedView",
    component: SharedView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
