<template>
  <div class="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 text-gray-900">
    <header class="bg-white shadow border-b border-orange-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span>👀</span> Vue partagée - TimeCook
        </h1>
        <p v-if="ownerName" class="text-xs sm:text-sm text-gray-500">
          Horaires de {{ ownerName }}
        </p>
      </div>
    </header>

    <main v-if="!error" class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <!-- Summary Section -->
      <section class="bg-white shadow-lg rounded-xl p-6 border border-orange-100">
        <div class="flex flex-col gap-4 mb-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <span>📊</span> Résumé
            </h2>
            <select v-model="range" @change="onRangeChange" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
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
            <button @click="goToToday" class="px-3 py-2 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition whitespace-nowrap shadow-sm">
              🔄 Aujourd'hui
            </button>
          </div>
        </div>

        <div v-if="summary" class="space-y-4">
          <div class="bg-linear-to-r from-orange-50 to-orange-100/50 p-4 rounded-lg border border-orange-200">
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

          <!-- Desktop table -->
          <div class="hidden sm:block max-h-80 overflow-auto border border-gray-200 rounded-lg">
            <table class="w-full text-sm">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="text-left p-3 font-semibold">Date</th>
                  <th class="text-left p-3 font-semibold">Détails</th>
                  <th class="text-right p-3 font-semibold">Heures</th>
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
            </div>
          </div>
        </div>
        <div v-else-if="!loading" class="text-center text-gray-500 py-8">
          Aucune entrée pour cette période
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          Chargement...
        </div>
      </section>

      <!-- Info banner -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-800">
          ℹ️ Ceci est une vue en lecture seule. Vous pouvez consulter les horaires mais pas les modifier.
        </p>
      </div>
    </main>

    <!-- Error state -->
    <main v-else class="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p class="text-lg font-semibold text-red-800 mb-2">❌ Accès refusé</p>
        <p class="text-sm text-red-600">{{ error }}</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/fr';
dayjs.extend(isoWeek);
dayjs.locale('fr');

const route = useRoute();

const userId = ref(route.params.userId);
const email = ref(route.query.email);
const ownerName = ref('');
const loading = ref(true);
const error = ref('');

const range = ref('week');
const start = ref(dayjs().format('YYYY-MM-DD'));
const summary = ref(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

async function refreshSummary() {
  loading.value = true;
  error.value = '';
  
  if (!email.value) {
    error.value = 'Email requis pour accéder à cette vue';
    loading.value = false;
    return;
  }
  
  try {
    let weekStart = start.value;
    if (range.value === 'week') {
      weekStart = dayjs(start.value).isoWeekday(1).format('YYYY-MM-DD');
    }
    
    const { data } = await axios.get(`${API_URL}/shared/${userId.value}/summary`, {
      params: { 
        range: range.value, 
        start: weekStart,
        email: email.value 
      }
    });
    
    summary.value = data;
    ownerName.value = data.ownerName || 'Utilisateur';
    loading.value = false;
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur de chargement';
    loading.value = false;
  }
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

onMounted(() => {
  refreshSummary();
});
</script>
