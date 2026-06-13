<template>
    <div class="min-h-screen bg-[#fff8f1] text-gray-950">
    <header class="sticky top-0 z-10 border-b border-orange-100/80 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-lg bg-orange-500 text-white shadow-sm shadow-orange-500/20">
            <Clock3 class="h-5 w-5" />
          </span>
          <div>
            <h1 class="text-xl font-semibold leading-none text-gray-950">TimeCook</h1>
            <p class="mt-1 text-sm text-gray-500">{{ user?.name || user?.email }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50" @click="$emit('settings')" aria-label="Paramètres">
            <SettingsIcon class="h-5 w-5" />
          </button>
          <button class="inline-flex h-10 items-center gap-2 rounded-lg bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800" @click="$emit('logout')">
            <LogOut class="h-4 w-4" />
            <span class="hidden sm:inline">Se déconnecter</span>
          </button>
        </div>
      </div>
    </header>

  <main class="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
      <!-- Add Entry Section -->
      <section class="rounded-xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-orange-600">Saisie</p>
            <h2 class="mt-1 text-xl font-semibold text-gray-950">Ajouter une entrée</h2>
          </div>
          <Plus class="h-5 w-5 text-orange-500" />
        </div>
        
        <!-- Copy buttons -->
        <div v-if="!form.isSchoolDay" class="mb-6">
          <p class="text-xs text-gray-500 mb-2 font-medium">Copier le dernier service</p>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="copyLastService('morning')" class="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 transition hover:bg-orange-100">
              <Sun class="h-4 w-4" />
              Matin
            </button>
            <button type="button" @click="copyLastService('evening')" class="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700 transition hover:bg-orange-100">
              <Moon class="h-4 w-4" />
              Soir
            </button>
          </div>
        </div>
        <p v-if="prefillMessage" class="mb-4 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm font-medium text-green-700">
          <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
          {{ prefillMessage }}
        </p>
        
        <form @submit.prevent="addEntry" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Date</label>
            <input v-model="form.date" type="date" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-date-and-time-value]:leading-none" required />
          </div>

          <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label class="text-sm font-medium cursor-pointer flex items-center gap-2 text-gray-700">
              <input type="checkbox" v-model="form.isSchoolDay" class="w-4 h-4 accent-gray-900 cursor-pointer rounded" />
              <GraduationCap class="h-4 w-4 text-orange-500" />
              Jour de cours
            </label>
          </div>

          <template v-if="form.isSchoolDay">
            <div class="flex flex-col gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700">Début des cours</label>
                <input v-model="form.schoolStart" type="time" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-date-and-time-value]:leading-none" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700">Fin des cours</label>
                <input v-model="form.schoolEnd" type="time" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-date-and-time-value]:leading-none" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700">Pause (minutes)</label>
                <input v-model.number="form.schoolPause" type="number" min="0" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="ex: 45" />
              </div>
              <div v-if="schoolDuration !== null" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                Durée nette : <span class="font-semibold text-gray-900">{{ formatMinutes(schoolDuration) }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700">Service</label>
                <select v-model="form.service" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white">
                  <option value="morning">Matin</option>
                  <option value="evening">Soir</option>
                  <option value="full">Autre</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700">Début</label>
                <input v-model="form.startTime" type="time" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-date-and-time-value]:leading-none" required />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700">Fin</label>
              <input v-model="form.endTime" type="time" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-date-and-time-value]:leading-none" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700">Pause (minutes)</label>
              <input v-model.number="form.breakMinutes" type="number" min="0" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all" placeholder="ex: 45" />
              <p class="text-xs text-gray-500 mt-2">Par défaut: {{ defaultBreak }} min</p>
            </div>
          </template>

          

          <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3.5 font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600">
            <Plus class="h-5 w-5" />
            Ajouter l'entrée
          </button>
          
          <Transition name="success">
            <p v-if="ok" class="flex items-start gap-2 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
              Entrée ajoutée avec succès.
            </p>
          </Transition>
          
          <p v-if="err" class="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ err }}
          </p>
        </form>
      </section>

      <!-- Summary Section -->
      <section class="rounded-xl border border-orange-100 bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-col gap-6 mb-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-950">
              Résumé
            </h2>
            <select v-model="range" @change="onRangeChange" class="border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white transition-all">
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
          
          <!-- Navigation -->
          <div class="flex flex-col items-center gap-3">
            <div class="flex items-center gap-3 w-full">
              <button @click="goToPrevious" class="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200" aria-label="Période précédente">
                <ChevronLeft class="h-5 w-5" />
              </button>
              <div class="flex-1 text-center font-medium text-gray-900">
                {{ periodLabel }}
              </div>
              <button @click="goToNext" class="grid h-10 w-10 place-items-center rounded-lg bg-gray-100 text-gray-700 transition hover:bg-gray-200" aria-label="Période suivante">
                <ChevronRight class="h-5 w-5" />
              </button>
            </div>
            <button @click="goToToday" class="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 font-medium">
              Aujourd'hui
            </button>
          </div>
        </div>

        <div v-if="summary" class="space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 text-center">
              <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Total</p>
              <p class="text-lg sm:text-xl font-semibold text-gray-900">{{ formatHours(summary.totalMinutes) }}</p>
            </div>

            <div class="bg-orange-50 rounded-2xl p-4 border border-orange-200 text-center">
              <p class="text-xs text-orange-600 uppercase tracking-wide font-medium mb-1">Objectif</p>
              <p class="text-lg sm:text-xl font-semibold text-orange-600">{{ Math.round(summary.targetHours) }}h</p>
            </div>

            <div class="rounded-2xl p-4 border text-center" :class="(summary.totalMinutes - Math.round(summary.targetHours * 60)) > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'">
              <p class="text-xs uppercase tracking-wide font-medium mb-1" :class="(summary.totalMinutes - Math.round(summary.targetHours * 60)) > 0 ? 'text-red-600' : 'text-green-600'">
                {{ (summary.totalMinutes - Math.round(summary.targetHours * 60)) > 0 ? 'Sup.' : 'Reste' }}
              </p>
              <p class="text-lg sm:text-xl font-semibold" :class="(summary.totalMinutes - Math.round(summary.targetHours * 60)) > 0 ? 'text-red-600' : 'text-green-600'">
                {{ formatHours(Math.max(0, summary.totalMinutes - Math.round(summary.targetHours * 60))) }}
              </p>
            </div>
          </div>

          <!-- Actions: toggle details + quick export -->
          <div class="flex items-center justify-between">
            <button @click="showDetails = !showDetails" class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
              <List class="h-4 w-4" />
              {{ showDetails ? 'Masquer les jours' : 'Afficher les jours' }}
            </button>
            <button @click="exportCsv" class="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              <Download class="h-4 w-4" />
              Exporter CSV
            </button>
          </div>


          <!-- Details list -->
          <div v-if="showDetails" class="space-y-3">
            <!-- Desktop table -->
            <div class="hidden sm:block overflow-hidden rounded-2xl border border-gray-200">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="text-left p-4 font-semibold text-gray-700">Date</th>
                    <th class="text-left p-4 font-semibold text-gray-700">Horaires</th>
                    <th class="text-right p-4 font-semibold text-gray-700">Total</th>
                    <th class="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="d in summary.byDate" :key="d.date" class="hover:bg-gray-50 transition-colors">
                    <td class="p-4 font-medium text-gray-900">{{ formatDate(d.date) }}</td>
                    <td class="p-4 align-top">
                      <div v-if="d.isSchoolDay" class="flex items-center gap-2 text-sm text-blue-700">
                        <span class="inline-flex items-center gap-1.5 font-medium"><GraduationCap class="h-4 w-4" /> Cours</span>
                        <span class="text-xs font-medium text-blue-600/70">- {{ d.schoolHours || 7 }}h</span>
                      </div>
                      <div v-else class="space-y-1">
                        <div v-for="s in d.services" :key="s.service + s.startTime" class="text-sm text-gray-700">
                          <component :is="serviceIcon(s.service)" class="mr-1 inline h-4 w-4 text-orange-500" />
                          <span class="font-mono">{{ s.startTime }}–{{ s.endTime }}</span>
                          <span v-if="s.breakMinutesUsed > 0" class="text-xs text-gray-500"> • pause {{ s.breakMinutesUsed }} min</span>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 text-right font-semibold text-gray-900">{{ formatMinutes(d.minutes) }}</td>
                    <td class="p-4">
                      <div class="flex items-center justify-center gap-2">
                        <button @click="openEditModal(d)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Modifier">
                          <Pencil class="h-4 w-4 text-gray-600" />
                        </button>
                        <button @click="deleteEntry(d.date)" class="p-2 hover:bg-red-50 rounded-lg transition-colors" aria-label="Supprimer">
                          <Trash2 class="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile list -->
            <div class="sm:hidden space-y-3">
              <div v-for="d in summary.byDate" :key="d.date" class="bg-white border border-gray-200 rounded-2xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="font-semibold text-gray-900">{{ formatDate(d.date) }}</div>
                  <div class="font-semibold text-gray-900">{{ formatMinutes(d.minutes) }}</div>
                </div>
                
                <div v-if="d.isSchoolDay" class="mb-2 flex items-center gap-2 text-sm text-blue-700">
                  <span class="inline-flex items-center gap-1.5 font-medium"><GraduationCap class="h-4 w-4" /> Cours</span>
                  <span class="text-xs font-medium text-blue-600/70">- {{ d.schoolHours || 7 }}h</span>
                </div>
                
                <div v-else class="mb-2 space-y-1">
                  <div v-for="s in d.services" :key="s.service + s.startTime" class="text-sm text-gray-700">
                    <component :is="serviceIcon(s.service)" class="mr-1 inline h-4 w-4 text-orange-500" />
                    <span class="font-mono">{{ s.startTime }}–{{ s.endTime }}</span>
                    <span v-if="s.breakMinutesUsed > 0" class="text-xs text-gray-500"> • pause {{ s.breakMinutesUsed }} min</span>
                  </div>
                </div>
                
                <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                  <button @click="openEditModal(d)" class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"><Pencil class="h-4 w-4" />Modifier</button>
                  <button @click="deleteEntry(d.date)" class="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"><Trash2 class="h-4 w-4" />Supprimer</button>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <button @click="exportCsv" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 font-medium text-gray-950 transition hover:bg-gray-200">
              <Download class="h-4 w-4" />
              Exporter CSV
            </button>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          Aucune entrée pour cette période
        </div>
      </section>
    </main>

    <!-- Edit Entry Modal -->
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
import { api } from '../api';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/fr';
import EditEntryModal from './EditEntryModal.vue';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  GraduationCap,
  List,
  LogOut,
  Moon,
  Pencil,
  Plus,
  Settings as SettingsIcon,
  Sun,
  Trash2,
  TriangleAlert,
  CalendarDays,
} from '@lucide/vue';
dayjs.extend(isoWeek);
dayjs.locale('fr');

const props = defineProps({ user: Object });
const emit = defineEmits(['logout', 'settings']);

const form = ref({ 
  date: dayjs().format('YYYY-MM-DD'), 
  service: 'morning', 
  startTime: '', 
  endTime: '', 
  isSchoolDay: false, 
  schoolStart: '',
  schoolEnd: '',
  schoolPause: 60,
  breakMinutes: null,
});
const schoolDuration = computed(() => {
  if (!form.value.isSchoolDay) return null;
  if (!form.value.schoolStart || !form.value.schoolEnd) return null;
  const [h1, m1] = form.value.schoolStart.split(':').map(Number);
  const [h2, m2] = form.value.schoolEnd.split(':').map(Number);
  let mins = (h2 * 60 + m2) - (h1 * 60 + m1) - (form.value.schoolPause || 0);
  if (mins < 0) mins += 24 * 60;
  return mins;
});
const err = ref('');
const ok = ref(false);
const prefillMessage = ref('');

const range = ref('week');
const start = ref(dayjs().format('YYYY-MM-DD'));
const summary = ref(null);
const entries = ref([]);
const showDetails = ref(true);

const defaultBreak = ref(45);

const periodLabel = computed(() => {
  if (!start.value) return '';
  const d = dayjs(start.value);
  if (range.value === 'week') {
    const weekStart = d.isoWeekday(1);
    const weekEnd = d.isoWeekday(7);
    return `${weekStart.format('DD/MM')} - ${weekEnd.format('DD/MM/YYYY')}`;
  } else {
    return d.format('MMMM YYYY');
  }
});

function labelService(s) {
  if (s === 'morning') return 'Matin';
  if (s === 'evening') return 'Soir';
  return 'Service';
}

function serviceIcon(s) {
  if (s === 'morning') return Sun;
  if (s === 'evening') return Moon;
  return CalendarDays;
}

function formatDate(d) {
  return dayjs(d).format('DD/MM');
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

function hmToMinLocal(hm) {
  if (!hm) return 0;
  const [h, m] = hm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function crossesMidnight(start, end) {
  return hmToMinLocal(end) < hmToMinLocal(start);
}

async function loadUserDefaults() {
  try {
    const { data } = await api.get('/auth/me');
    defaultBreak.value = data.user.defaultBreakMinutes || 45;
    if (!form.value.isSchoolDay && (form.value.breakMinutes === null || form.value.breakMinutes === undefined)) {
      form.value.breakMinutes = defaultBreak.value;
    }
  } catch (e) {
    console.error(e);
  }
}

async function addEntry() {
  err.value = '';
  ok.value = false;
  try {
    const payload = { ...form.value };
    if (payload.isSchoolDay) {
      delete payload.service; delete payload.startTime; delete payload.endTime;
      // Calculer schoolHours à partir des inputs
      if (form.value.schoolStart && form.value.schoolEnd) {
        const [h1, m1] = form.value.schoolStart.split(':').map(Number);
        const [h2, m2] = form.value.schoolEnd.split(':').map(Number);
        let mins = (h2 * 60 + m2) - (h1 * 60 + m1) - (form.value.schoolPause || 0);
        if (mins < 0) mins += 24 * 60;
        payload.schoolHours = +(mins / 60).toFixed(2);
      } else {
        payload.schoolHours = null;
      }
      delete payload.schoolStart;
      delete payload.schoolEnd;
      delete payload.schoolPause;
    } else {
      delete payload.schoolHours;
      delete payload.schoolStart;
      delete payload.schoolEnd;
      delete payload.schoolPause;
      if (payload.breakMinutes === null || payload.breakMinutes === undefined || payload.breakMinutes === '') {
        payload.breakMinutes = defaultBreak.value;
      }
    }
    await api.post('/entries', payload);
    ok.value = true;
    form.value.schoolStart = '';
    form.value.schoolEnd = '';
    form.value.schoolPause = 0;
    await refreshSummary();
    setTimeout(() => { ok.value = false; }, 2000);
  } catch (e) {
    err.value = e?.response?.data?.error || 'Erreur';
  }
}

async function refreshSummary() {
  let weekStart = start.value;
  if (range.value === 'week') {
    // Forcer le début de semaine au lundi
    weekStart = dayjs(start.value).isoWeekday(1).format('YYYY-MM-DD');
  }
  const { data } = await api.get('/entries/summary', { params: { range: range.value, start: weekStart } });
  summary.value = data;
  // Also load full entries for deletion
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
  // Quand on change de range, on repart sur aujourd'hui
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

async function copyLastService(serviceType) {
  try {
    err.value = '';
    prefillMessage.value = '';
    
    // Chercher dans les 30 derniers jours
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const { data } = await api.get('/entries', { params: { start: startDate, end: endDate } });
    
    // Filtrer les entrées du type de service demandé
    const matchingEntries = data.filter(e => !e.isSchoolDay && e.service === serviceType);
    
    if (matchingEntries.length === 0) {
      err.value = `Aucun service ${serviceType === 'morning' ? 'matin' : 'soir'} trouvé dans les 30 derniers jours`;
      setTimeout(() => { err.value = ''; }, 3000);
      return;
    }
    
    // Prendre le plus récent
    const lastEntry = matchingEntries[matchingEntries.length - 1];
    
    form.value.service = lastEntry.service;
    form.value.startTime = lastEntry.startTime || '';
    form.value.endTime = lastEntry.endTime || '';
    form.value.breakMinutes = lastEntry.breakMinutes || defaultBreak.value;
    form.value.isSchoolDay = false;
    
    prefillMessage.value = `Copié du ${dayjs(lastEntry.date).format('DD/MM/YYYY')} : ${labelService(lastEntry.service)} ${lastEntry.startTime}-${lastEntry.endTime}`;
    setTimeout(() => { prefillMessage.value = ''; }, 5000);
  } catch (e) {
    err.value = 'Erreur lors de la copie';
    setTimeout(() => { err.value = ''; }, 3000);
  }
}

// Edit modal
const editModalOpen = ref(false);
const entryToEdit = ref(null);

function openEditModal(dayData) {
  // Find the actual entry from entries array
  const entry = entries.value.find(e => e.date === dayData.date);
  if (entry) {
    entryToEdit.value = entry;
    editModalOpen.value = true;
  }
}

async function onEntrySaved() {
  await refreshSummary();
  ok.value = true;
  setTimeout(() => { ok.value = false; }, 2000);
}

onMounted(() => {
  loadUserDefaults();
  refreshSummary();
});

</script>

<style scoped>
/* Success animation */
.success-enter-active {
  animation: fade-in 0.3s ease-out;
}
.success-leave-active {
  animation: fade-out 0.2s ease-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Smooth backdrop blur */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}
</style>
