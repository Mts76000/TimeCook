<template>
  <div>
    <Transition name="fade" mode="out-in">
      <LandingPage v-if="showLanding && !user" @go-to-auth="showLanding = false" key="landing" />
      <AuthForm v-else-if="!user && !showSettings" @authed="onAuthed" @back-to-landing="showLanding = true" key="auth" />
      <Settings v-else-if="showSettings" @back="showSettings = false" key="settings" />
      <Dashboard v-else :user="user" @logout="logout" @settings="showSettings = true" key="dashboard" />
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LandingPage from './components/LandingPage.vue';
import AuthForm from './components/AuthForm.vue';
import Dashboard from './components/Dashboard.vue';
import Settings from './components/Settings.vue';
import { api, setAuthToken } from './api';

const user = ref(null);
const showLanding = ref(true);
const showSettings = ref(false);

async function fetchMe() {
  try {
    const { data } = await api.get('/auth/me');
    user.value = data.user;
  } catch {
    user.value = null;
  }
}

function onAuthed(u) {
  user.value = u;
}

function logout() {
  setAuthToken(null);
  user.value = null;
  showLanding.value = true;
  showSettings.value = false;
}

onMounted(fetchMe);
</script>

<style>
/* Fade transition for page changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
