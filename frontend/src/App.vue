<template>
  <div>
    <LandingPage v-if="showLanding && !user" @go-to-auth="showLanding = false" />
    <AuthForm v-else-if="!user" @authed="onAuthed" @back-to-landing="showLanding = true" />
    <Dashboard v-else :user="user" @logout="logout" />
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LandingPage from './components/LandingPage.vue';
import AuthForm from './components/AuthForm.vue';
import Dashboard from './components/Dashboard.vue';
import { api, setAuthToken } from './api';

const user = ref(null);
const showLanding = ref(true);

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
}

onMounted(fetchMe);
</script>

