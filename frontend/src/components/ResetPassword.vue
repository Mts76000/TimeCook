<template>
  <div class="flex min-h-screen flex-col bg-cream text-ink">
    <header class="border-b border-border bg-paper px-4 py-4 sm:px-6">
      <div class="mx-auto max-w-5xl">
        <router-link to="/" class="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink-light transition hover:text-ink">
          <ArrowLeft class="h-4 w-4" />
          Retour
        </router-link>
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="mb-8 flex items-center gap-3">
          <img src="/logo.jpeg" alt="TimeCook" class="h-10 w-10 object-cover" />
          <div>
            <h1 class="text-xl font-semibold">TimeCook</h1>
            <p class="text-sm text-ink-muted">Réinitialisation du mot de passe</p>
          </div>
        </div>

        <form v-if="!success" @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="newPassword">Nouveau mot de passe</label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="new-password"
                class="h-12 w-full rounded-md border border-border bg-paper px-3 pr-10 text-base transition hover:border-border-strong focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
                placeholder="Votre nouveau mot de passe"
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
          </div>

          <button
            type="submit"
            class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-clay font-semibold text-white transition hover:bg-clay-dark"
          >
            Réinitialiser le mot de passe
            <ArrowRight class="h-5 w-5" />
          </button>
        </form>

        <p v-else class="rounded-md border border-olive bg-olive-soft p-4 text-sm font-medium text-olive">
          Votre mot de passe a été mis à jour. Vous pouvez maintenant <router-link to="/" class="underline">vous connecter</router-link>.
        </p>

        <p v-if="error" class="mt-5 flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-3 text-sm font-medium text-terracotta">
          <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
          {{ error }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../api';
import { ArrowLeft, ArrowRight, Eye, EyeOff, TriangleAlert } from '@lucide/vue';

const route = useRoute();
const router = useRouter();

const token = ref('');
const newPassword = ref('');
const showPassword = ref(false);
const error = ref('');
const success = ref(false);

onMounted(() => {
  token.value = route.query.token || '';
  if (!token.value) {
    error.value = 'Lien de réinitialisation invalide.';
  }
});

async function onSubmit() {
  error.value = '';
  try {
    await api.post('/auth/reset-password', { token: token.value, newPassword: newPassword.value });
    success.value = true;
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur lors de la réinitialisation';
  }
}
</script>
