<template>
  <div class="min-h-screen bg-cream text-ink">
    <header class="sticky top-0 z-10 border-b border-border bg-paper">
      <div class="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
        <img src="/logo.jpeg" alt="TimeCook" class="h-8 w-8 object-cover" />
        <button @click="$emit('back')" class="grid h-9 w-9 place-items-center rounded-md border border-border bg-paper text-ink transition hover:bg-cream" aria-label="Retour">
          <ChevronLeft class="h-5 w-5" />
        </button>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Compte</p>
          <h1 class="text-xl font-semibold leading-tight">Paramètres</h1>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <!-- Profile -->
      <section class="rounded-xl border border-border bg-paper p-5 sm:p-8">
        <div class="mb-6 flex items-start gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-md bg-clay-light text-clay-dark">
            <User class="h-5 w-5" />
          </span>
          <div>
            <h2 class="text-lg font-semibold">Profil</h2>
            <p class="text-sm text-ink-muted">Votre nom d’affichage.</p>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="name">Nom</label>
            <input
              id="name"
              v-model.trim="profile.name"
              type="text"
              class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium" for="email">Email</label>
            <input
              id="email"
              :value="profile.email"
              type="email"
              disabled
              class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base text-ink-muted"
            />
          </div>

          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-clay py-3.5 font-semibold text-white transition hover:bg-clay-dark">
            <Save class="h-4 w-4" />
            Sauvegarder le profil
          </button>

          <Transition name="success">
            <p v-if="profileSuccess" class="flex items-start gap-2 rounded-md border border-olive bg-olive-soft p-4 text-sm font-medium text-olive">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
              Profil sauvegardé.
            </p>
          </Transition>

          <p v-if="profileError" class="flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-4 text-sm font-medium text-terracotta">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ profileError }}
          </p>
        </form>
      </section>

      <!-- Objectives -->
      <section class="rounded-xl border border-border bg-paper p-5 sm:p-8">
        <div class="mb-6 flex items-start gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-md bg-clay-light text-clay-dark">
            <SlidersHorizontal class="h-5 w-5" />
          </span>
          <div>
            <h2 class="text-lg font-semibold">Objectifs personnalisables</h2>
            <p class="text-sm text-ink-muted">Ces valeurs servent au résumé hebdomadaire et mensuel.</p>
          </div>
        </div>

        <form @submit.prevent="saveObjectives" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="weekly">Objectif hebdomadaire (heures)</label>
            <input
              id="weekly"
              v-model.number="objectives.weeklyTargetHours"
              type="number"
              min="1"
              max="168"
              step="0.5"
              class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              required
            />
            <p class="mt-1.5 text-xs text-ink-muted">Par défaut : 35h</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium" for="monthly">Objectif mensuel (heures)</label>
            <input
              id="monthly"
              v-model.number="objectives.monthlyTargetHours"
              type="number"
              min="1"
              max="744"
              step="0.5"
              class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              required
            />
            <p class="mt-1.5 text-xs text-ink-muted">Par défaut : 152h</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium" for="break">Pause par défaut (minutes)</label>
            <input
              id="break"
              v-model.number="objectives.defaultBreakMinutes"
              type="number"
              min="0"
              max="300"
              class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              required
            />
            <p class="mt-1.5 text-xs text-ink-muted">Par défaut : 45min</p>
          </div>

          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-clay py-3.5 font-semibold text-white transition hover:bg-clay-dark">
            <Save class="h-4 w-4" />
            Sauvegarder
          </button>

          <Transition name="success">
            <p v-if="objectivesSuccess" class="flex items-start gap-2 rounded-md border border-olive bg-olive-soft p-4 text-sm font-medium text-olive">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
              Objectifs sauvegardés.
            </p>
          </Transition>

          <p v-if="objectivesError" class="flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-4 text-sm font-medium text-terracotta">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ objectivesError }}
          </p>
        </form>
      </section>

      <!-- Password -->
      <section class="rounded-xl border border-border bg-paper p-5 sm:p-8">
        <div class="mb-6 flex items-start gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-md bg-clay-light text-clay-dark">
            <Lock class="h-5 w-5" />
          </span>
          <div>
            <h2 class="text-lg font-semibold">Mot de passe</h2>
            <p class="text-sm text-ink-muted">Changez votre mot de passe actuel.</p>
          </div>
        </div>

        <form @submit.prevent="changePassword" class="space-y-5">
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="currentPassword">Mot de passe actuel</label>
            <div class="relative">
              <input
                id="currentPassword"
                v-model="passwords.current"
                :type="showCurrent ? 'text' : 'password'"
                required
                class="h-12 w-full rounded-md border border-border bg-cream px-3 pr-10 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              />
              <button
                type="button"
                @click="showCurrent = !showCurrent"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-muted transition hover:text-ink"
              >
                <Eye v-if="!showCurrent" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium" for="newPassword">Nouveau mot de passe</label>
            <div class="relative">
              <input
                id="newPassword"
                v-model="passwords.new"
                :type="showNew ? 'text' : 'password'"
                required
                class="h-12 w-full rounded-md border border-border bg-cream px-3 pr-10 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              />
              <button
                type="button"
                @click="showNew = !showNew"
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-ink-muted transition hover:text-ink"
              >
                <Eye v-if="!showNew" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-clay py-3.5 font-semibold text-white transition hover:bg-clay-dark">
            <Lock class="h-4 w-4" />
            Changer le mot de passe
          </button>

          <Transition name="success">
            <p v-if="passwordSuccess" class="flex items-start gap-2 rounded-md border border-olive bg-olive-soft p-4 text-sm font-medium text-olive">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
              Mot de passe mis à jour.
            </p>
          </Transition>

          <p v-if="passwordError" class="flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-4 text-sm font-medium text-terracotta">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ passwordError }}
          </p>
        </form>
      </section>

      <!-- Share -->
      <section class="rounded-xl border border-border bg-paper p-5 sm:p-8">
        <div class="mb-6 flex items-start gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-md bg-clay-light text-clay-dark">
            <Share2 class="h-5 w-5" />
          </span>
          <div>
            <h2 class="text-lg font-semibold">Partager</h2>
            <p class="text-sm text-ink-muted">Générez un lien en lecture seule pour votre employeur ou formateur.</p>
          </div>
        </div>

        <div class="space-y-3">
          <button
            type="button"
            @click="generateShareLink"
            class="inline-flex w-full items-center justify-center gap-2 rounded-md border border-ink bg-paper py-3.5 font-semibold text-ink transition hover:bg-cream"
          >
            <Share2 class="h-4 w-4" />
            Générer un lien
          </button>

          <div v-if="shareUrl" class="rounded-md border border-border bg-cream p-3">
            <p class="text-xs text-ink-muted">Lien de partage</p>
            <div class="mt-1 flex items-center gap-2">
              <input :value="shareUrl" readonly class="h-10 w-full rounded-md border border-border bg-paper px-2 text-sm" />
              <button type="button" @click="copyShareUrl" class="grid h-10 w-10 place-items-center rounded-md border border-border bg-paper transition hover:bg-cream">
                <Copy class="h-4 w-4" />
              </button>
            </div>
          </div>

          <p v-if="shareError" class="flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-3 text-sm font-medium text-terracotta">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ shareError }}
          </p>
        </div>
      </section>

      <!-- Legal & delete -->
      <section class="rounded-xl border border-border bg-paper p-5 sm:p-8">
        <div class="mb-6 flex items-start gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-md bg-clay-light text-clay-dark">
            <Shield class="h-5 w-5" />
          </span>
          <div>
            <h2 class="text-lg font-semibold">Confidentialité</h2>
            <p class="text-sm text-ink-muted">Vos droits et vos données.</p>
          </div>
        </div>

        <div class="space-y-4">
          <router-link to="/legal" class="inline-flex items-center gap-2 rounded-md border border-border bg-paper px-4 py-2.5 text-sm font-medium transition hover:bg-cream">
            <FileText class="h-4 w-4" />
            Mentions légales & RGPD
          </router-link>

          <div class="border-t border-border pt-4">
            <p class="text-sm font-medium">Supprimer mon compte</p>
            <p class="text-sm text-ink-muted">Cette action supprime vos informations personnelles et toutes vos entrées. Elle est irréversible.</p>
            <button
              v-if="!confirmDelete"
              type="button"
              @click="confirmDelete = true"
              class="mt-3 inline-flex items-center gap-2 rounded-md border border-terracotta bg-terracotta-soft px-4 py-2.5 text-sm font-medium text-terracotta transition hover:bg-terracotta hover:text-white"
            >
              <Trash2 class="h-4 w-4" />
              Supprimer mon compte
            </button>

            <div v-else class="mt-3 rounded-md border border-terracotta bg-terracotta-soft p-4">
              <p class="text-sm font-medium text-terracotta">Confirmer la suppression ?</p>
              <div class="mt-2 flex gap-2">
                <button type="button" @click="confirmDelete = false" class="rounded-md border border-border bg-paper px-3 py-2 text-sm font-medium transition hover:bg-cream">
                  Annuler
                </button>
                <button type="button" @click="deleteAccount" class="rounded-md bg-terracotta px-3 py-2 text-sm font-medium text-white transition hover:bg-terracotta/90">
                  Oui, supprimer
                </button>
              </div>
            </div>

            <p v-if="deleteError" class="mt-3 flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-3 text-sm font-medium text-terracotta">
              <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
              {{ deleteError }}
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api, setAuthToken } from '../api';
import { CheckCircle2, ChevronLeft, Copy, Eye, EyeOff, FileText, Lock, Save, Settings2, Share2, Shield, SlidersHorizontal, Trash2, TriangleAlert, User } from '@lucide/vue';

const emit = defineEmits(['back', 'logout']);

const profile = ref({ name: '', email: '' });
const profileSuccess = ref(false);
const profileError = ref('');

const objectives = ref({
  weeklyTargetHours: 35,
  monthlyTargetHours: 152,
  defaultBreakMinutes: 45,
});

const objectivesSuccess = ref(false);
const objectivesError = ref('');

const passwords = ref({ current: '', new: '' });
const showCurrent = ref(false);
const showNew = ref(false);
const passwordSuccess = ref(false);
const passwordError = ref('');

const confirmDelete = ref(false);
const deleteError = ref('');
const shareUrl = ref('');
const shareError = ref('');

async function loadSettings() {
  try {
    const [{ data: userData }, { data: settingsData }] = await Promise.all([
      api.get('/auth/me'),
      api.get('/settings'),
    ]);
    profile.value.name = userData.user.name || '';
    profile.value.email = userData.user.email || '';
    objectives.value.weeklyTargetHours = settingsData.weeklyTargetHours || 35;
    objectives.value.monthlyTargetHours = settingsData.monthlyTargetHours || 152;
    objectives.value.defaultBreakMinutes = settingsData.defaultBreakMinutes || 45;
  } catch (e) {
    console.error('Erreur:', e);
  }
}

async function saveProfile() {
  profileSuccess.value = false;
  profileError.value = '';
  try {
    await api.patch('/auth/me', { name: profile.value.name });
    profileSuccess.value = true;
    setTimeout(() => { profileSuccess.value = false; }, 3000);
  } catch (e) {
    profileError.value = e?.response?.data?.error || 'Erreur';
    setTimeout(() => { profileError.value = ''; }, 5000);
  }
}

async function saveObjectives() {
  objectivesSuccess.value = false;
  objectivesError.value = '';
  try {
    await api.patch('/settings', {
      weeklyTargetHours: objectives.value.weeklyTargetHours,
      monthlyTargetHours: objectives.value.monthlyTargetHours,
      defaultBreakMinutes: objectives.value.defaultBreakMinutes,
    });
    objectivesSuccess.value = true;
    setTimeout(() => { objectivesSuccess.value = false; }, 3000);
  } catch (e) {
    objectivesError.value = e?.response?.data?.error || 'Erreur';
    setTimeout(() => { objectivesError.value = ''; }, 5000);
  }
}

async function changePassword() {
  passwordSuccess.value = false;
  passwordError.value = '';
  try {
    await api.patch('/auth/me/password', {
      currentPassword: passwords.value.current,
      newPassword: passwords.value.new,
    });
    passwordSuccess.value = true;
    passwords.value = { current: '', new: '' };
    setTimeout(() => { passwordSuccess.value = false; }, 3000);
  } catch (e) {
    passwordError.value = e?.response?.data?.error || 'Erreur';
    setTimeout(() => { passwordError.value = ''; }, 5000);
  }
}

async function generateShareLink() {
  shareError.value = '';
  shareUrl.value = '';
  try {
    const { data } = await api.post('/auth/share');
    shareUrl.value = data.url;
  } catch (e) {
    shareError.value = e?.response?.data?.error || 'Erreur';
  }
}

async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
  } catch {}
}

async function deleteAccount() {
  deleteError.value = '';
  try {
    await api.delete('/auth/me');
    setAuthToken(null);
    emit('logout');
  } catch (e) {
    deleteError.value = e?.response?.data?.error || 'Erreur';
  }
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
.success-enter-active {
  animation: fade-in 0.25s ease-out;
}
.success-leave-active {
  animation: fade-out 0.2s ease-in;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-out {
  to { opacity: 0; transform: translateY(-8px); }
}
</style>
