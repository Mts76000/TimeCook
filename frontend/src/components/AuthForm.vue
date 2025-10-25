<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
    <div class="w-full max-w-md bg-white shadow rounded-lg p-6">
      <h1 class="text-2xl font-semibold mb-4">TimeCook</h1>
      <p class="text-sm text-gray-500 mb-6">Connexion ou création de compte</p>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input v-model="email" type="email" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="ex: user@mail.com" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Mot de passe</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800" />
        </div>
        <div v-if="mode==='register'">
          <label class="block text-sm font-medium mb-1">Nom (optionnel)</label>
          <input v-model="name" type="text" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800" />
        </div>

        <button type="submit" class="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">{{ mode==='login' ? 'Se connecter' : 'Créer un compte' }}</button>
      </form>

      <p class="mt-4 text-sm text-center">
        <button class="text-gray-700 underline" @click="toggleMode">
          {{ mode==='login' ? "Pas de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter' }}
        </button>
      </p>

      <p v-if="error" class="text-red-600 mt-3 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { api, setAuthToken } from '../api';

const emit = defineEmits(['authed']);

const mode = ref('login');
const email = ref('');
const password = ref('');
const name = ref('');
const error = ref('');

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  error.value = '';
}

async function onSubmit() {
  error.value = '';
  try {
    const url = mode.value === 'login' ? '/auth/login' : '/auth/register';
    const payload = mode.value === 'login' ? { email: email.value, password: password.value } : { email: email.value, password: password.value, name: name.value };
    const { data } = await api.post(url, payload);
    setAuthToken(data.token);
    emit('authed', data.user);
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur';
  }
}
</script>
