import { createRouter, createWebHistory } from 'vue-router';
import App from './AppWrapper.vue';
import SharedView from './components/SharedView.vue';

const routes = [
  {
    path: '/',
    component: App,
  },
  {
    path: '/shared/:userId',
    name: 'SharedView',
    component: SharedView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
