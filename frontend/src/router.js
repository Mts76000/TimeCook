import { createRouter, createWebHistory } from "vue-router";
import AppWrapper from "./AppWrapper.vue";

const routes = [
  {
    path: "/",
    component: AppWrapper,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
