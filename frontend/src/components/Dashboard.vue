<template>
  <div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 text-gray-900">
    <header class="bg-white shadow sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800">TimeCook ⏰</h1>
          <p class="text-xs sm:text-sm text-gray-500 truncate max-w-[200px]">{{ user?.name || user?.email }}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition" @click="$emit('logout')">Se déconnecter</button>
        </div>
      </div>
    </header>

  <main class="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Add Entry Section -->
      <section class="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>➕</span> Ajouter une entrée
        </h2>
        
        <!-- Copy buttons -->
        <div v-if="!form.isSchoolDay" class="flex gap-2 mb-4">
          <button type="button" @click="copyLastService('morning')" class="flex-1 text-xs px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition border border-orange-200">
            🌅 Copier dernier matin
          </button>
          <button type="button" @click="copyLastService('evening')" class="flex-1 text-xs px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition border border-indigo-200">
            🌙 Copier dernier soir
          </button>
        </div>
        <p v-if="prefillMessage" class="text-xs text-green-700 mb-3 bg-green-50 p-2 rounded">
          ✓ {{ prefillMessage }}
        </p>
        
        <form @submit.prevent="addEntry" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Date</label>
            <input v-model="form.date" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" required />
          </div>

          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <label class="text-sm font-medium cursor-pointer flex items-center gap-2">
              <input type="checkbox" v-model="form.isSchoolDay" class="w-4 h-4 accent-gray-800" />
              📚 Jour de cours
            </label>
          </div>

          <template v-if="form.isSchoolDay">
            <div class="flex flex-col gap-3">
              <div>
                <label class="block text-sm font-medium mb-2">Début des cours</label>
                <input v-model="form.schoolStart" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Fin des cours</label>
                <input v-model="form.schoolEnd" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Pause (minutes)</label>
                <input v-model.number="form.schoolPause" type="number" min="0" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="ex: 45" />
              </div>
              <div v-if="schoolDuration !== null" class="text-xs text-gray-700 mt-1">
                Durée nette calculée : <span class="font-bold">{{ formatMinutes(schoolDuration) }}</span>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="flex flex-col sm:grid sm:grid-cols-2 gap-4">
              <div class="min-w-0">
                <label class="block text-sm font-medium mb-2">Service</label>
                <select v-model="form.service" class="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800">
                  <option value="morning">🌅 Matin</option>
                  <option value="evening">🌙 Soir</option>
                  <option value="full">📅 Autre</option>
                </select>
              </div>
              <div class="min-w-0">
                <label class="block text-sm font-medium mb-2">Début</label>
                <input v-model="form.startTime" type="time" class="w-full min-w-0 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" required />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Fin</label>
              <input v-model="form.endTime" type="time" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Pause (minutes)</label>
              <input v-model.number="form.breakMinutes" type="number" min="0" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800" placeholder="ex: 45" />
              <p class="text-xs text-gray-500 mt-1">Par défaut: {{ defaultBreak }} min</p>
            </div>
          </template>

          

          <button type="submit" class="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition shadow-md">
            ➕ Ajouter l'entrée
          </button>
          <p v-if="err" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg">❌ {{ err }}</p>
          <p v-if="ok" class="text-green-700 text-sm bg-green-50 p-3 rounded-lg">✓ Entrée ajoutée avec succès</p>
        </form>
      </section>

      <!-- Summary Section -->
      <section class="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div class="flex flex-col gap-4 mb-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              <span>📊</span> Résumé
            </h2>
            <select v-model="range" @change="onRangeChange" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800">
              <option value="week">Semaine</option>
              <option value="month">Mois</option>
            </select>
          </div>
          
          <!-- Navigation -->
          <div class="flex flex-col items-center gap-2">
            <div class="flex items-center gap-2">
            <button @click="goToPrevious" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition border border-gray-300">
              ◀
            </button>
            <div class="flex-1 text-center font-medium text-gray-800">
              {{ periodLabel }}
            </div>
            <button @click="goToNext" class="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition border border-gray-300">
              ▶
            </button>
            </div>
            <button @click="goToToday" class="px-3 py-2 text-xs bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition whitespace-nowrap">
              🔄 Aujourd'hui
            </button>
          </div>
        </div>

        <div v-if="summary" class="space-y-4">
          <div class="bg-linear-to-r from-gray-100 to-gray-50 p-4 rounded-lg border border-gray-200">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600">Total heures</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatMinutes(summary.totalMinutes) }}</p>
              </div>
              <div>
                <p class="text-gray-600">Objectif {{ range === 'week' ? 'semaine' : 'mois' }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ formatMinutes(Math.round(summary.targetHours * 60)) }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-gray-600">Heures supplémentaires</p>
                <p class="text-2xl font-bold" :class="(summary.totalMinutes - Math.round(summary.targetHours * 60)) > 0 ? 'text-orange-600' : 'text-green-600'">
                  {{ formatMinutes(Math.max(0, summary.totalMinutes - Math.round(summary.targetHours * 60))) }}
                </p>
              </div>
            </div>
          </div>

          <div class="hidden sm:block max-h-80 overflow-auto border border-gray-200 rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="text-left p-3 font-semibold">Date</th>
                  <th class="text-left p-3 font-semibold">Détails</th>
                  <th class="text-right p-3 font-semibold">Heures</th>
                  <th class="text-center p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in summary.byDate" :key="d.date" class="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td class="p-3 font-medium">{{ formatDate(d.date) }}</td>
                  <td class="p-3 text-gray-700">
                    <span v-if="d.isSchoolDay" class="inline-flex items-center gap-1">
                      📚 Cours ({{ d.schoolHours || 7 }}h)
                    </span>
                    <template v-else>
                      <div v-for="s in d.services" :key="s.service + s.startTime" class="flex items-center gap-1">
                        <span>{{ labelService(s.service) }}:</span>
                        <span class="font-mono text-xs">{{ s.startTime }}–{{ s.endTime }}</span>
                        <span v-if="crossesMidnight(s.startTime, s.endTime)" class="ml-1 text-[10px] px-1 py-0.5 rounded bg-gray-200 text-gray-700">+1j</span>
                        <span class="text-xs text-gray-500">(pause {{ s.breakMinutesUsed }}min)</span>
                      </div>
                    </template>
                  </td>
                  <td class="p-3 text-right font-semibold">{{ formatMinutes(d.minutes) }}</td>
                  <td class="p-3 text-center">
                    <button @click="deleteEntry(d.date)" class="text-red-600 hover:text-red-800 text-sm">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Mobile list -->
          <div class="sm:hidden space-y-3">
            <div v-for="d in summary.byDate" :key="d.date" class="bg-white border border-gray-200 rounded-lg p-3">
              <div class="flex items-center justify-between">
                <div class="font-medium">{{ formatDate(d.date) }}</div>
                <div class="text-sm font-semibold">{{ formatMinutes(d.minutes) }}</div>
              </div>
              <div class="mt-1 text-sm text-gray-700">
                <span v-if="d.isSchoolDay">📚 Cours ({{ d.schoolHours || 7 }}h)</span>
                <template v-else>
                  <div v-for="s in d.services" :key="s.service + s.startTime" class="flex items-center gap-1">
                    <span>{{ labelService(s.service) }}</span>
                    <span class="font-mono text-xs">{{ s.startTime }}–{{ s.endTime }}</span>
                    <span v-if="crossesMidnight(s.startTime, s.endTime)" class="ml-1 text-[10px] px-1 py-0.5 rounded bg-gray-200 text-gray-700">+1j</span>
                    <span class="text-xs text-gray-500">(pause {{ s.breakMinutesUsed }}min)</span>
                  </div>
                </template>
              </div>
              <div class="mt-2 text-right">
                <button @click="deleteEntry(d.date)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Supprimer</button>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button @click="exportCsv" class="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow">📥 Exporter CSV</button>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          Aucune entrée pour cette période
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../api';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/fr';
dayjs.extend(isoWeek);
dayjs.locale('fr');

const props = defineProps({ user: Object });
const emit = defineEmits(['logout']);

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
  return dayjs(d).format('ddd DD/MM');
}

function formatMinutes(mins) {
  const sign = mins < 0 ? '-' : '';
  const m = Math.abs(mins);
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  return `${sign}${h}h${mm}`;
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

onMounted(() => {
  loadUserDefaults();
  refreshSummary();
});
</script>
