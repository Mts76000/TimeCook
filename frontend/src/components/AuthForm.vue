<template>
  <div class="flex min-h-screen flex-col bg-cream text-ink">
    <header class="border-b border-border bg-paper px-4 py-4 sm:px-6">
      <div class="mx-auto max-w-5xl">
        <button @click="goBack" class="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink-light transition hover:text-ink">
          <ArrowLeft class="h-4 w-4" />
          <span>Retour</span>
        </button>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:grid lg:grid-cols-2 lg:gap-12 lg:py-16 lg:justify-center">
      <!-- Side panel -->
      <div class="hidden flex-col justify-center rounded-xl border border-border bg-paper p-6 lg:order-1 lg:flex lg:p-8">
        <img src="/logo.jpeg" alt="TimeCook" class="h-12 w-12 object-cover" />
        <h2 class="mt-5 text-2xl font-semibold tracking-tight">
          {{ mode === 'login' ? 'Bon retour sur TimeCook' : 'Créer votre espace' }}
        </h2>
        <p class="mt-2 text-ink-light">
          {{ mode === 'login'
            ? 'Connectez-vous pour reprendre votre suivi.'
            : 'Quelques infos et vous pourrez suivre vos services, cours et objectifs.' }}
        </p>

        <div class="mt-6 space-y-3">
          <div class="flex items-start gap-3">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-clay-light text-clay">
              <Clock3 class="h-4 w-4" />
            </span>
            <div>
              <p class="font-medium">Services et cours</p>
              <p class="text-sm text-ink-muted">Notez matin, soir ou journée de cours.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-clay-light text-clay">
              <CalendarDays class="h-4 w-4" />
            </span>
            <div>
              <p class="font-medium">Objectif semaine & mois</p>
              <p class="text-sm text-ink-muted">Voyez où vous en êtes en un coup d’œil.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-clay-light text-clay">
              <Download class="h-4 w-4" />
            </span>
            <div>
              <p class="font-medium">Export CSV</p>
              <p class="text-sm text-ink-muted">Récupérez vos données quand vous en avez besoin.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="order-1 flex flex-col justify-center lg:order-2">
        <div class="mb-6 flex items-center gap-3 lg:hidden">
          <img src="/logo.jpeg" alt="TimeCook" class="h-10 w-10 object-cover" />
          <div>
            <h1 class="text-xl font-semibold">TimeCook</h1>
            <p class="text-sm text-ink-muted">{{ formTitle }}</p>
          </div>
        </div>

        <form v-if="mode !== 'forgot'" @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="h-12 w-full rounded-md border border-border bg-paper px-3 text-base transition hover:border-border-strong focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              placeholder="votre@email.com"
            />
          </div>

          <div v-if="mode !== 'forgot'">
            <label class="mb-1.5 block text-sm font-medium" for="password">Mot de passe</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                class="h-12 w-full rounded-md border border-border bg-paper px-3 pr-10 text-base transition hover:border-border-strong focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-muted transition hover:text-ink"
                :aria-label="showPassword ? 'Masquer' : 'Afficher'"
              >
                <Eye v-if="!showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
            <button v-if="mode === 'login'" type="button" @click="mode = 'forgot'" class="mt-2 text-sm text-ink-light transition hover:text-clay">
              Mot de passe oublié ?
            </button>
          </div>

          <div v-if="mode === 'register'">
            <label class="mb-1.5 block text-sm font-medium" for="name">Nom (optionnel)</label>
            <input
              id="name"
              v-model="name"
              type="text"
              class="h-12 w-full rounded-md border border-border bg-paper px-3 text-base transition hover:border-border-strong focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              placeholder="Votre nom"
            />
          </div>

          <button
            type="submit"
            class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-clay font-semibold text-white transition hover:bg-clay-dark"
          >
            {{ submitLabel }}
            <ArrowRight class="h-5 w-5" />
          </button>
        </form>

        <form v-else @submit.prevent="sendReset" class="space-y-5">
          <p class="text-ink-light">Entrez votre email pour recevoir un lien de réinitialisation.</p>
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="email">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="h-12 w-full rounded-md border border-border bg-paper px-3 text-base transition hover:border-border-strong focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              placeholder="votre@email.com"
            />
          </div>

          <button
            type="submit"
            class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-clay font-semibold text-white transition hover:bg-clay-dark"
          >
            Envoyer le lien
            <ArrowRight class="h-5 w-5" />
          </button>
        </form>

        <div v-if="!success" class="mt-6 text-center text-sm">
          <button @click="toggleMode" class="font-medium text-ink-light transition hover:text-clay-dark">
            {{ toggleLabel }}
          </button>
        </div>

        <p v-if="success" class="mt-5 flex items-start gap-2 rounded-md border border-olive bg-olive-soft p-4 text-sm font-medium text-olive">
          <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
          {{ success }}
        </p>

        <p v-if="error" class="mt-5 flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-3 text-sm font-medium text-terracotta">
          <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
          {{ error }}
        </p>
      </div>
    </main>

    <footer class="border-t border-border bg-paper px-4 py-5 text-center text-sm text-ink-muted">
      <p>TimeCook — Suivi d’heures pour alternants</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { api, setAuthToken } from '../api';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Clock3, Download, Eye, EyeOff, TriangleAlert } from '@lucide/vue';

const emit = defineEmits(['authed', 'back-to-landing']);

const mode = ref('login');
const email = ref('');
const password = ref('');
const name = ref('');
const showPassword = ref(false);
const error = ref('');
const success = ref('');

const formTitle = computed(() => {
  if (mode.value === 'login') return 'Connexion';
  if (mode.value === 'register') return 'Nouveau compte';
  return 'Mot de passe oublié';
});

const submitLabel = computed(() => {
  if (mode.value === 'login') return 'Se connecter';
  if (mode.value === 'register') return 'Créer mon compte';
  return 'Envoyer le lien';
});

const toggleLabel = computed(() => {
  if (mode.value === 'login') return "Pas encore de compte ? S'inscrire";
  if (mode.value === 'register') return 'Déjà inscrit ? Se connecter';
  return 'Retour à la connexion';
});

function goBack() {
  if (mode.value === 'forgot') {
    mode.value = 'login';
  } else {
    emit('back-to-landing');
  }
}

function toggleMode() {
  if (mode.value === 'forgot') {
    mode.value = 'login';
  } else {
    mode.value = mode.value === 'login' ? 'register' : 'login';
  }
  error.value = '';
  success.value = '';
}

async function onSubmit() {
  error.value = '';
  success.value = '';
  try {
    const url = mode.value === 'login' ? '/auth/login' : '/auth/register';
    const payload = mode.value === 'login'
      ? { email: email.value, password: password.value }
      : { email: email.value, password: password.value, name: name.value };
    const { data } = await api.post(url, payload);
    setAuthToken(data.token);
    emit('authed', data.user);
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur de connexion';
  }
}

async function sendReset() {
  error.value = '';
  success.value = '';
  try {
    await api.post('/auth/forgot-password', { email: email.value });
    success.value = 'Si ce compte existe, un email de réinitialisation a été envoyé.';
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur';
  }
}
</script>
