<template>
    <div class="min-h-screen bg-gray-50 text-gray-900">
    <header class="bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900">TimeCook</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ user?.name || user?.email }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200" @click="$emit('settings')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </button>
          <button class="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-sm" @click="$emit('logout')">Se déconnecter</button>
        </div>
      </div>
    </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Add Entry Section -->
      <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">Ajouter une entrée</h2>
        
        <!-- Copy buttons -->
        <div v-if="!form.isSchoolDay" class="mb-6">
          <p class="text-xs text-gray-500 mb-2 font-medium">Copier le dernier service</p>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="copyLastService('morning')" class="px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition-all duration-200 border border-orange-200 text-sm font-medium">
              🌅 Matin
            </button>
            <button type="button" @click="copyLastService('evening')" class="px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition-all duration-200 border border-orange-200 text-sm font-medium">
              🌙 Soir
            </button>
          </div>
        </div>
        <p v-if="prefillMessage" class="text-sm text-green-600 mb-4 bg-green-50 p-3 rounded-xl font-medium">
          ✓ {{ prefillMessage }}
        </p>
        
        <form @submit.prevent="addEntry" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Date</label>
            <input v-model="form.date" type="date" class="w-full border border-gray-300 rounded-xl px-4 h-12 text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0 [&::-webkit-date-and-time-value]:leading-none" required />
          </div>

          <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label class="text-sm font-medium cursor-pointer flex items-center gap-2 text-gray-700">
              <input type="checkbox" v-model="form.isSchoolDay" class="w-4 h-4 accent-gray-900 cursor-pointer rounded" />
              📚 Jour de cours
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
                  <option value="morning">🌅 Matin</option>
                  <option value="evening">🌙 Soir</option>
                  <option value="full">📅 Autre</option>
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

          

          <button type="submit" class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all duration-200 shadow-sm">
            Ajouter l'entrée
          </button>
          
          <Transition name="success">
            <p v-if="ok" class="text-green-600 text-sm bg-green-50 p-4 rounded-xl font-medium">✓ Entrée ajoutée avec succès !</p>
          </Transition>
          
          <p v-if="err" class="text-red-600 text-sm bg-red-50 p-4 rounded-xl font-medium">❌ {{ err }}</p>
        </form>
      </section>

      <!-- Summary Section -->
      <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div class="flex flex-col gap-6 mb-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
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
              <button @click="goToPrevious" class="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div class="flex-1 text-center font-medium text-gray-900">
                {{ periodLabel }}
              </div>
              <button @click="goToNext" class="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
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
            <button @click="showDetails = !showDetails" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors text-sm font-medium">
              {{ showDetails ? 'Masquer les jours' : 'Afficher les jours' }}
            </button>
            <button @click="exportCsv" class="px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors text-sm font-medium">
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
                      <div v-if="d.isSchoolDay" class="text-sm text-blue-700">
                        <span class="font-medium">📚 Cours</span>
                        <span class="text-xs text-blue-600/70"> — {{ d.schoolHours || 7 }}h</span>
                      </div>
                      <div v-else class="space-y-1">
                        <div v-for="s in d.services" :key="s.service + s.startTime" class="text-sm text-gray-700">
                          <span class="font-mono">{{ s.startTime }}–{{ s.endTime }}</span>
                          <span v-if="s.breakMinutesUsed > 0" class="text-xs text-gray-500"> • pause {{ s.breakMinutesUsed }} min</span>
                        </div>
                      </div>
                    </td>
                    <td class="p-4 text-right font-semibold text-gray-900">{{ formatMinutes(d.minutes) }}</td>
                    <td class="p-4">
                      <div class="flex items-center justify-center gap-2">
                        <button @click="openEditModal(d)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button @click="deleteEntry(d.date)" class="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
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
                
                <div v-if="d.isSchoolDay" class="mb-2 text-sm text-blue-700">
                  <span class="font-medium">📚 Cours</span>
                  <span class="text-xs text-blue-600/70"> — {{ d.schoolHours || 7 }}h</span>
                </div>
                
                <div v-else class="mb-2 space-y-1">
                  <div v-for="s in d.services" :key="s.service + s.startTime" class="text-sm text-gray-700">
                    <span class="font-mono">{{ s.startTime }}–{{ s.endTime }}</span>
                    <span v-if="s.breakMinutesUsed > 0" class="text-xs text-gray-500"> • pause {{ s.breakMinutesUsed }} min</span>
                  </div>
                </div>
                
                <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                  <button @click="openEditModal(d)" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium">Modifier</button>
                  <button @click="deleteEntry(d.date)" class="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium">Supprimer</button>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <button @click="exportCsv" class="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl transition-all duration-200">
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
  if (s === 'morning') return '🌅 Matin';
  if (s === 'evening') return '🌙 Soir';
  return '📅 Service';
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

