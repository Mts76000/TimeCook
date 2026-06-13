<template>
  <div class="flex min-h-screen flex-col bg-[#fbfaf8] text-slate-900">
    <header class="border-b border-orange-100 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6">
      <div class="mx-auto max-w-6xl">
        <button @click="$emit('back-to-landing')" class="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-700">
          <ArrowLeft class="h-4 w-4" />
          <span>Retour</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
      <div class="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl shadow-orange-900/5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside class="hidden border-r border-orange-100 bg-[#fff8f1] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div class="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm shadow-orange-500/20">
              <ChefHat class="h-6 w-6" />
            </div>
            <h1 class="mt-8 text-3xl font-semibold tracking-normal text-slate-950">TimeCook</h1>
            <p class="mt-4 max-w-sm leading-7 text-slate-600">
              Gardez vos heures de service, vos jours de cours et vos objectifs au même endroit.
            </p>
          </div>
          <div class="space-y-3 text-sm text-slate-600">
            <p class="inline-flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-orange-600" /> Calcul des pauses</p>
            <p class="inline-flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-orange-600" /> Résumé semaine et mois</p>
            <p class="inline-flex items-center gap-2"><CheckCircle2 class="h-4 w-4 text-orange-600" /> Export CSV</p>
          </div>
        </aside>

        <main class="p-6 sm:p-8 lg:p-12">
          <div class="mb-8">
            <div class="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm shadow-orange-500/20 lg:hidden">
              <ChefHat class="h-6 w-6" />
            </div>
            <p class="text-sm font-semibold uppercase tracking-wide text-orange-600">
              {{ mode === 'login' ? 'Connexion' : 'Inscription' }}
            </p>
            <h2 class="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
              {{ mode === 'login' ? 'Bon retour' : 'Créer votre espace' }}
            </h2>
            <p class="mt-2 text-slate-600">
              {{ mode === 'login' ? 'Connectez-vous pour reprendre votre suivi.' : 'Quelques infos et vous pouvez commencer.' }}
            </p>
          </div>

          <form @submit.prevent="onSubmit" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
              <input 
                v-model="email" 
                type="email" 
                required 
                autocomplete="email" 
                class="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[16px] text-slate-950 placeholder-slate-400 transition focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100" 
                placeholder="votre@email.com" 
              />
            </div>
            
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
              <input 
                v-model="password" 
                type="password" 
                required 
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" 
                class="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[16px] text-slate-950 placeholder-slate-400 transition focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100" 
                placeholder="Votre mot de passe"
              />
            </div>
            
            <div v-if="mode === 'register'">
              <label class="mb-2 block text-sm font-medium text-slate-700">Nom (optionnel)</label>
              <input 
                v-model="name" 
                type="text" 
                class="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-[16px] text-slate-950 placeholder-slate-400 transition focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-100" 
                placeholder="Votre nom"
              />
            </div>

            <button 
              type="submit" 
              class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
            >
              {{ mode === 'login' ? 'Se connecter' : 'Créer mon compte' }}
              <ArrowRight class="h-5 w-5" />
            </button>
          </form>

          <div class="mt-6 text-center text-sm">
            <button @click="toggleMode" class="font-medium text-slate-600 transition hover:text-orange-700">
              {{ mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà inscrit ? Se connecter' }}
            </button>
          </div>

          <p v-if="error" class="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ error }}
          </p>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { api, setAuthToken } from '../api';
import { ArrowLeft, ArrowRight, CheckCircle2, ChefHat, TriangleAlert } from '@lucide/vue';

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
