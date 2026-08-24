<template>
  <div class="min-h-screen bg-cream text-ink">
    <header class="sticky top-0 z-10 border-b border-border bg-paper">
      <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex items-center gap-3">
          <img src="/logo.jpeg" alt="TimeCook" class="h-8 w-8 object-cover" />
          <div>
            <h1 class="text-base font-semibold leading-tight">TimeCook</h1>
            <p class="text-xs text-ink-muted">{{ user?.name || user?.email }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="hidden h-9 items-center gap-2 rounded-md bg-clay px-4 text-sm font-semibold text-white transition hover:bg-clay-dark sm:inline-flex" @click="openAddModal">
            <Plus class="h-4 w-4" />
            Ajouter
          </button>
          <button class="grid h-9 w-9 place-items-center rounded-md border border-border bg-paper text-ink transition hover:bg-cream" @click="$emit('settings')" aria-label="Paramètres">
            <SettingsIcon class="h-5 w-5" />
          </button>
          <button class="grid h-9 w-9 place-items-center rounded-md border border-border bg-paper text-ink transition hover:bg-cream" @click="$emit('logout')" aria-label="Déconnexion">
            <LogOut class="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-3xl space-y-5 px-4 py-5 pb-24 sm:px-6 sm:py-6 sm:pb-6">
      <!-- Summary -->
      <div class="overflow-hidden rounded-xl border border-border bg-paper">
        <div class="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ range === 'week' ? 'Cette semaine' : 'Ce mois' }}</p>
            <p class="mt-1 text-2xl font-semibold tracking-tight">{{ periodLabel }}</p>
          </div>
          <div class="flex items-center gap-2">
            <select v-model="range" @change="onRangeChange" class="h-9 rounded-md border border-border bg-cream px-3 text-sm font-medium focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light">
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
            <button @click="goToPrevious" class="grid h-9 w-9 place-items-center rounded-md border border-border bg-paper transition hover:bg-cream" aria-label="Période précédente">
              <ChevronLeft class="h-5 w-5" />
            </button>
            <button @click="goToToday" class="rounded-md border border-border bg-paper px-3 py-2 text-sm font-medium transition hover:bg-cream">
              Auj.
            </button>
            <button @click="goToNext" class="grid h-9 w-9 place-items-center rounded-md border border-border bg-paper transition hover:bg-cream" aria-label="Période suivante">
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div v-if="summary" class="p-4 sm:p-5">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
            <span class="text-4xl font-semibold tracking-tight sm:text-5xl" :class="statusColorClass">{{ formatMinutes(summary.totalMinutes) }}</span>
            <span class="text-lg text-ink-muted">sur {{ Math.round(summary.targetHours) }}h</span>
          </div>

          <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="progressBarClass"
              :style="{ width: Math.min(progress, 100) + '%' }"
            ></div>
          </div>

          <p class="mt-2 text-sm font-medium" :class="statusTextClass">
            {{ statusMessage }}
          </p>

          <div class="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-5">
            <div>
              <p class="text-xs text-ink-muted">Total</p>
              <p class="mt-1 text-lg font-semibold">{{ formatHours(summary.totalMinutes) }}</p>
            </div>
            <div>
              <p class="text-xs text-ink-muted">Objectif</p>
              <p class="mt-1 text-lg font-semibold">{{ Math.round(summary.targetHours) }}h</p>
            </div>
            <div>
              <p class="text-xs" :class="remaining >= 0 ? 'text-olive' : 'text-terracotta'">{{ remainingLabel }}</p>
              <p class="mt-1 text-lg font-semibold" :class="remaining >= 0 ? 'text-olive' : 'text-terracotta'">{{ formatHours(Math.abs(remaining)) }}</p>
            </div>
          </div>

          <div v-if="chartDays.length" class="mt-5 border-t border-border pt-5">
            <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Vue jours</p>
            <div class="mt-3 flex h-40 items-end gap-2 overflow-x-auto pb-2">
              <div
                v-for="day in chartDays"
                :key="day.date"
                class="group flex w-10 min-w-[2.5rem] flex-col items-center gap-1"
              >
                <div class="relative flex w-full items-end rounded-t-md bg-cream" style="height: 100px;">
                  <div
                    class="w-full rounded-t-md bg-clay transition hover:bg-clay-dark"
                    :style="{ height: day.barHeight }"
                  ></div>
                  <div class="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[10px] text-paper opacity-0 transition group-hover:opacity-100">
                    {{ day.hm }}
                  </div>
                </div>
                <span class="text-[10px] font-medium text-ink-muted">{{ day.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-8 text-center text-ink-muted">
          Chargement…
        </div>
      </div>

      <!-- Mobile CTA (if no data) -->
      <button class="flex w-full items-center justify-center gap-2 rounded-md bg-clay py-3.5 font-semibold text-white transition hover:bg-clay-dark sm:hidden" @click="openAddModal">
        <Plus class="h-5 w-5" />
        Ajouter une entrée
      </button>

      <!-- Timeline -->
      <div v-if="summary?.byDate?.length" class="rounded-xl border border-border bg-paper p-4 sm:p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold">Détail des jours</h2>
          <button @click="exportCsv" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-paper px-3 py-2 text-sm font-medium transition hover:bg-cream">
            <Download class="h-4 w-4" />
            CSV
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="d in summary.byDate" :key="d.date" class="flex items-start gap-3 rounded-lg border border-border p-3">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border bg-paper">
              <component :is="dayIcon(d)" class="h-3.5 w-3.5" :class="dayIconClass(d)" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <p class="text-sm font-semibold">{{ formatDate(d.date) }}</p>
                <p class="font-mono text-base font-semibold">{{ formatMinutes(d.minutes) }}</p>
              </div>
              <div v-if="d.isSchoolDay" class="text-sm text-slate">
                Jour de cours — {{ d.schoolHours || 7 }}h
              </div>
              <div v-else class="mt-1 flex flex-wrap gap-2 text-sm text-ink-light">
                <span v-for="s in d.services" :key="s.service + s.startTime" class="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs">
                  <component :is="serviceIcon(s.service)" class="h-3 w-3" :class="serviceIconClass(s.service)" />
                  {{ s.startTime }}–{{ s.endTime }}
                  <span v-if="s.breakMinutesUsed > 0" class="text-ink-muted">· pause {{ s.breakMinutesUsed }}min</span>
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button @click="openEditModal(d)" class="grid h-8 w-8 place-items-center rounded-md text-ink-light transition hover:bg-cream hover:text-ink" aria-label="Modifier">
                <Pencil class="h-4 w-4" />
              </button>
              <button @click="deleteEntry(d.date)" class="grid h-8 w-8 place-items-center rounded-md text-ink-light transition hover:bg-terracotta-soft hover:text-terracotta" aria-label="Supprimer">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="summary" class="rounded-xl border border-dashed border-border bg-paper p-8 text-center text-ink-muted">
        <CalendarDays class="mx-auto h-8 w-8 text-ink-muted" />
        <p class="mt-2">Aucune entrée pour cette période</p>
      </div>
    </main>

    <!-- Mobile FAB -->
    <button
      class="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-clay text-white shadow-lg shadow-clay/30 transition hover:bg-clay-dark sm:hidden"
      @click="openAddModal"
      aria-label="Ajouter une entrée"
    >
      <Plus class="h-7 w-7" />
    </button>

    <AddEntryModal
      :is-open="addModalOpen"
      :default-break="defaultBreak"
      @close="addModalOpen = false"
      @added="onEntryAdded"
    />

    <EditEntryModal
      :is-open="editModalOpen"
      :entry="entryToEdit"
      @close="editModalOpen = false"
      @saved="onEntrySaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/fr';
import { api } from '../api';
import AddEntryModal from './AddEntryModal.vue';
import EditEntryModal from './EditEntryModal.vue';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  GraduationCap,
  LogOut,
  Moon,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Sun,
  Trash2,
} from '@lucide/vue';

dayjs.extend(isoWeek);
dayjs.locale('fr');

const props = defineProps({ user: Object });
const emit = defineEmits(['logout', 'settings']);

const range = ref('week');
const start = ref(dayjs().format('YYYY-MM-DD'));
const summary = ref(null);
const entries = ref([]);
const defaultBreak = ref(45);
const addModalOpen = ref(false);
const editModalOpen = ref(false);
const entryToEdit = ref(null);

const periodLabel = computed(() => {
  if (!start.value) return '';
  const d = dayjs(start.value);
  if (range.value === 'week') {
    const weekStart = d.isoWeekday(1);
    const weekEnd = d.isoWeekday(7);
    return `${weekStart.format('DD/MM')} – ${weekEnd.format('DD/MM/YYYY')}`;
  }
  return d.format('MMMM YYYY');
});

const progress = computed(() => {
  if (!summary.value) return 0;
  return (summary.value.totalMinutes / (summary.value.targetHours * 60)) * 100;
});

const remaining = computed(() => {
  if (!summary.value) return 0;
  return Math.round(summary.value.targetHours * 60) - summary.value.totalMinutes;
});

const remainingLabel = computed(() => remaining.value >= 0 ? 'Reste' : 'Excès');

const statusMessage = computed(() => {
  if (!summary.value) return '';
  const diff = summary.value.totalMinutes - Math.round(summary.value.targetHours * 60);
  if (diff === 0) return 'Vous êtes pile sur l’objectif.';
  if (diff > 0) return `Vous avez ${formatMinutes(diff)} d’heures supplémentaires.`;
  return `Il vous reste ${formatMinutes(Math.abs(diff))} à faire.`;
});

const statusColorClass = computed(() => {
  if (!summary.value) return 'text-ink';
  const diff = summary.value.totalMinutes - Math.round(summary.value.targetHours * 60);
  if (diff > 0) return 'text-terracotta';
  if (diff >= -0.5 * 60) return 'text-olive';
  return 'text-clay';
});

const statusTextClass = computed(() => {
  if (!summary.value) return 'text-ink';
  const diff = summary.value.totalMinutes - Math.round(summary.value.targetHours * 60);
  if (diff > 0) return 'text-terracotta';
  if (diff >= -0.5 * 60) return 'text-olive';
  return 'text-ink';
});

const progressBarClass = computed(() => {
  if (!summary.value) return 'bg-clay';
  const diff = summary.value.totalMinutes - Math.round(summary.value.targetHours * 60);
  if (diff > 0) return 'bg-terracotta';
  if (diff >= -0.5 * 60) return 'bg-olive';
  return 'bg-clay';
});

const chartDays = computed(() => {
  if (!summary.value?.byDate?.length) return [];
  const days = summary.value.byDate.filter(d => d.minutes > 0);
  const max = Math.max(1, ...days.map(d => d.minutes));
  return days.map(d => ({
    date: d.date,
    label: dayjs(d.date).format('ddd').replace('.', '').slice(0, 3),
    hm: formatMinutes(d.minutes),
    barHeight: `${Math.max(8, (d.minutes / max) * 100)}%`,
  }));
});

function dayIcon(d) {
  if (d.isSchoolDay) return GraduationCap;
  return d.services.length > 1 ? Clock3 : CalendarDays;
}

function dayIconClass(d) {
  if (d.isSchoolDay) return 'text-slate';
  if (d.services.length > 1) return 'text-ink';
  return 'text-clay';
}

function serviceIcon(s) {
  if (s === 'morning') return Sun;
  if (s === 'evening') return Moon;
  return Clock3;
}

function serviceIconClass(s) {
  if (s === 'morning') return 'text-clay';
  if (s === 'evening') return 'text-ink';
  return 'text-slate';
}

function formatDate(d) {
  return dayjs(d).format('dddd D MMMM');
}

function formatMinutes(mins) {
  const sign = mins < 0 ? '-' : '';
  const m = Math.abs(mins);
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  return `${sign}${h}h${mm}`;
}

function formatHours(mins) {
  if (mins == null) return '0h';
  const h = Math.round(mins / 60);
  return `${h}h`;
}

function openAddModal() {
  addModalOpen.value = true;
}

async function onEntryAdded() {
  await refreshSummary();
}

async function loadUserDefaults() {
  try {
    const { data } = await api.get('/auth/me');
    defaultBreak.value = data.user.defaultBreakMinutes || 45;
  } catch (e) {
    console.error(e);
  }
}

async function refreshSummary() {
  let weekStart = start.value;
  if (range.value === 'week') {
    weekStart = dayjs(start.value).isoWeekday(1).format('YYYY-MM-DD');
  }
  const { data } = await api.get('/entries/summary', { params: { range: range.value, start: weekStart } });
  summary.value = data;
  const { data: allEntries } = await api.get('/entries', { params: { start: data.start, end: data.end } });
  entries.value = allEntries;
}

async function deleteEntry(date) {
  if (!confirm(`Supprimer toutes les entrées du ${date} ?`)) return;
  try {
    const toDelete = entries.value.filter(e => e.date === date);
    await Promise.all(toDelete.map(e => api.delete(`/entries/${e._id}`)));
    await refreshSummary();
  } catch (e) {
    console.error(e);
  }
}

async function exportCsv() {
  const { data } = await api.get('/entries/summary', { params: { range: range.value, start: start.value } });
  const s = data.start, e = data.end;
  const resp = await api.get('/export', { params: { start: s, end: e }, responseType: 'blob' });
  const blob = new Blob([resp.data], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export_${s}_${e}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

function onRangeChange() {
  start.value = dayjs().format('YYYY-MM-DD');
  refreshSummary();
}

function goToToday() {
  start.value = dayjs().format('YYYY-MM-DD');
  refreshSummary();
}

function goToPrevious() {
  const d = dayjs(start.value);
  if (range.value === 'week') {
    start.value = d.subtract(1, 'week').format('YYYY-MM-DD');
  } else {
    start.value = d.subtract(1, 'month').format('YYYY-MM-DD');
  }
  refreshSummary();
}

function goToNext() {
  const d = dayjs(start.value);
  if (range.value === 'week') {
    start.value = d.add(1, 'week').format('YYYY-MM-DD');
  } else {
    start.value = d.add(1, 'month').format('YYYY-MM-DD');
  }
  refreshSummary();
}

function openEditModal(dayData) {
  const entry = entries.value.find(e => e.date === dayData.date);
  if (entry) {
    entryToEdit.value = entry;
    editModalOpen.value = true;
  }
}

async function onEntrySaved() {
  await refreshSummary();
}

onMounted(() => {
  loadUserDefaults();
  refreshSummary();
});
</script>
