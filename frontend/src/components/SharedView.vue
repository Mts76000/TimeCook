<template>
  <div v-if="loading" class="flex min-h-screen items-center justify-center bg-cream text-ink-muted">
    <p>Chargement…</p>
  </div>
  <div v-else-if="error" class="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
    <h1 class="text-2xl font-semibold">Lien invalide</h1>
    <p class="mt-2 text-ink-light">Ce lien de partage n’est plus actif ou n’existe pas.</p>
    <router-link to="/" class="mt-6 inline-flex items-center gap-2 rounded-md bg-clay px-6 py-3 font-semibold text-white hover:bg-clay-dark">
      <ArrowLeft class="h-5 w-5" />
      Retour
    </router-link>
  </div>
  <div v-else class="min-h-screen bg-cream text-ink">
    <header class="border-b border-border bg-paper px-4 py-4 sm:px-6">
      <div class="mx-auto flex max-w-5xl items-center gap-3">
        <img src="/logo.jpeg" alt="TimeCook" class="h-8 w-8 object-cover" />
        <div>
          <h1 class="text-lg font-semibold">TimeCook</h1>
          <p class="text-xs text-ink-muted">Vue partagée</p>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <section class="rounded-xl border border-border bg-paper p-5 sm:p-6">
        <p class="text-sm text-ink-muted">Planning partagé par</p>
        <h2 class="text-2xl font-semibold">{{ data.user.name }}</h2>

        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Total d’heures</p>
            <p class="mt-1 text-xl font-semibold">{{ formatMinutes(totalMinutes) }}</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Moyenne / jour</p>
            <p class="mt-1 text-xl font-semibold">{{ avgHours }}h</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Objectif hebdo</p>
            <p class="mt-1 text-xl font-semibold">{{ data.weeklyTargetHours }}h</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Objectif mensuel</p>
            <p class="mt-1 text-xl font-semibold">{{ data.monthlyTargetHours }}h</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Jours travaillés</p>
            <p class="mt-1 text-xl font-semibold">{{ workedDays }}</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Matin</p>
            <p class="mt-1 text-xl font-semibold">{{ countMorning }}</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Soir</p>
            <p class="mt-1 text-xl font-semibold">{{ countEvening }}</p>
          </div>
          <div class="rounded-lg bg-cream p-3">
            <p class="text-xs text-ink-muted">Cours</p>
            <p class="mt-1 text-xl font-semibold">{{ countSchool }}</p>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold">Répartition</h3>
          <div class="mt-3 h-3 w-full overflow-hidden rounded-full bg-cream">
            <div class="flex h-full w-full">
              <div class="h-full bg-clay" :style="{ width: shareMorning + '%' }"></div>
              <div class="h-full bg-ink" :style="{ width: shareEvening + '%' }"></div>
              <div class="h-full bg-slate" :style="{ width: shareSchool + '%' }"></div>
            </div>
          </div>
          <div class="mt-2 flex flex-wrap gap-3 text-xs text-ink-muted">
            <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-clay"></span> Matin</span>
            <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-ink"></span> Soir</span>
            <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-slate"></span> Cours</span>
          </div>
        </div>

        <div v-if="recentEntries.length" class="mt-6">
          <h3 class="text-lg font-semibold">Dernières saisies</h3>
          <div class="mt-3 space-y-3">
            <div
              v-for="e in recentEntries"
              :key="e._id"
              class="flex items-center justify-between rounded-md border border-border p-3"
            >
              <div>
                <p class="font-medium">{{ formatDate(e.date) }}</p>
                <p class="text-sm text-ink-muted">
                  <span v-if="e.isSchoolDay">Jour de cours · {{ e.schoolHours || 7 }}h</span>
                  <span v-else>{{ serviceLabel(e.service) }} · {{ e.startTime }}–{{ e.endTime }}</span>
                </p>
              </div>
              <p class="font-mono text-lg font-semibold">{{ formatMinutes(e.minutes) }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { api } from '../api';
import { ArrowLeft } from '@lucide/vue';

const route = useRoute();
const loading = ref(true);
const error = ref('');
const data = ref(null);

const entries = computed(() => {
  return (data.value?.entries || []).map((e) => ({
    ...e,
    minutes: e.isSchoolDay ? (e.schoolHours || 7) * 60 : computeMinutes(e),
  }));
});

const totalMinutes = computed(() => entries.value.reduce((s, e) => s + e.minutes, 0));
const avgHours = computed(() => {
  if (!entries.value.length) return 0;
  return Math.round((totalMinutes.value / entries.value.length) / 60);
});
const workedDays = computed(() => new Set(entries.value.map(e => e.date)).size);
const countMorning = computed(() => entries.value.filter(e => e.service === 'morning').length);
const countEvening = computed(() => entries.value.filter(e => e.service === 'evening').length);
const countSchool = computed(() => entries.value.filter(e => e.isSchoolDay).length);

const shareMorning = computed(() => {
  if (!entries.value.length) return 0;
  return (countMorning.value / entries.value.length) * 100;
});
const shareEvening = computed(() => {
  if (!entries.value.length) return 0;
  return (countEvening.value / entries.value.length) * 100;
});
const shareSchool = computed(() => {
  if (!entries.value.length) return 0;
  return (countSchool.value / entries.value.length) * 100;
});

const recentEntries = computed(() => {
  return [...entries.value].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10);
});

function computeMinutes(e) {
  const [h1, m1] = (e.startTime || '00:00').split(':').map(Number);
  const [h2, m2] = (e.endTime || '00:00').split(':').map(Number);
  let mins = h2 * 60 + m2 - (h1 * 60 + m1) - (e.breakMinutes || 0);
  if (mins < 0) mins += 24 * 60;
  return Math.max(0, mins);
}

function formatDate(d) {
  return dayjs(d).format('dddd D MMMM');
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const mm = String(mins % 60).padStart(2, '0');
  return `${h}h${mm}`;
}

function serviceLabel(s) {
  if (s === 'morning') return 'Matin';
  if (s === 'evening') return 'Soir';
  return 'Service';
}

onMounted(async () => {
  try {
    const { data: result } = await api.get(`/auth/share/${route.params.token}`);
    data.value = result;
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur';
  } finally {
    loading.value = false;
  }
});
</script>
