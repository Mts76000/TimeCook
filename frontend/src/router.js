import { createRouter, createWebHistory } from "vue-router";
import AppWrapper from "./AppWrapper.vue";
import Legal from "./components/Legal.vue";
import ResetPassword from "./components/ResetPassword.vue";
import NotFound from "./components/NotFound.vue";
import SharedView from "./components/SharedView.vue";

const routes = [
  {
    path: "/",
    component: AppWrapper,
  },
  {
    path: "/legal",
    component: Legal,
    meta: {
      title: "Mentions légales & confidentialité — TimeCook",
    },
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    meta: {
      title: "Réinitialiser mon mot de passe — TimeCook",
    },
  },
  {
    path: "/share/:token",
    component: SharedView,
    meta: {
      title: "Planning partagé — TimeCook",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: {
      title: "Page non trouvée — TimeCook",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  document.title = to.meta?.title || "TimeCook — Suivi d’heures pour alternants";
});

export default router;
