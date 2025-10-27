<template>
  <div class="min-h-screen flex flex-col bg-linear-to-br from-orange-50 via-white to-orange-50 text-gray-900">
    <!-- Header -->
    <header class="px-4 sm:px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div class="max-w-6xl mx-auto">
        <button @click="$emit('back-to-landing')" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
          <span>←</span>
          <span>Retour</span>
        </button>
      </div>
    </header>

    <!-- Auth Form -->
    <div class="flex-1 flex items-center justify-center px-4 py-8">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="flex items-center justify-center gap-2 mb-4">
            <span class="text-4xl">⏰</span>
            <h1 class="text-3xl font-bold text-gray-900">TimeCook</h1>
          </div>
          <p class="text-gray-600">
            {{ mode === 'login' ? 'Bon retour !' : 'Créez votre compte gratuitement' }}
          </p>
        </div>

        <div class="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          <form @submit.prevent="onSubmit" class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700">Email</label>
              <input 
                v-model="email" 
                type="email" 
                required 
                autocomplete="email" 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
                placeholder="votre@email.com" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700">Mot de passe</label>
              <input 
                v-model="password" 
                type="password" 
                required 
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
                placeholder="••••••••"
              />
            </div>
            
            <div v-if="mode === 'register'">
              <label class="block text-sm font-medium mb-2 text-gray-700">Nom (optionnel)</label>
              <input 
                v-model="name" 
                type="text" 
                class="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400" 
                placeholder="Votre nom"
              />
            </div>

            <button 
              type="submit" 
              class="w-full py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-base sm:text-lg transition shadow-lg"
            >
              {{ mode === 'login' ? 'Se connecter' : 'Créer mon compte' }}
            </button>
          </form>

          <div class="mt-6 text-center">
            <button @click="toggleMode" class="text-gray-600 hover:text-gray-900 transition">
              {{ mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter' }}
            </button>
          </div>

          <p v-if="error" class="mt-4 text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
            ⚠️ {{ error }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { api, setAuthToken } from '../api';

const emit = defineEmits(['authed', 'back-to-landing']);

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
    error.value = e?.response?.data?.error || 'Erreur de connexion';
  }
}
</script>
