<template>
  <div>
    <AuthForm v-if="!user" @authed="onAuthed" />
    <Dashboard v-else :user="user" @logout="logout" />
  </div>
  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AuthForm from './components/AuthForm.vue';
import Dashboard from './components/Dashboard.vue';
import { api, setAuthToken } from './api';

const user = ref(null);

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
}

onMounted(fetchMe);
</script>

