<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" @click.self="close">
    <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-paper p-5 shadow-xl sm:rounded-2xl">
      <div class="mb-5 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold leading-tight">Ajouter une entrée</h2>
          <p class="text-sm text-ink-muted">{{ dayjs().format('dddd D MMMM') }}</p>
        </div>
        <button @click="close" class="grid h-9 w-9 place-items-center rounded-md border border-border bg-paper text-ink transition hover:bg-cream">
          <X class="h-5 w-5" />
        </button>
      </div>

      <p v-if="prefillMessage" class="mb-4 flex items-start gap-2 rounded-md border border-olive bg-olive-soft p-3 text-sm font-medium text-olive">
        <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
        {{ prefillMessage }}
      </p>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium" for="date">Date</label>
          <input id="date" v-model="form.date" type="date" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" required />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <button
            type="button"
            @click="setEntryType('morning')"
            class="flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition"
            :class="entryType === 'morning' ? 'border-clay bg-clay-light text-clay-dark' : 'border-border bg-paper text-ink hover:border-clay'"
          >
            <Sun class="h-5 w-5" />
            Matin
          </button>
          <button
            type="button"
            @click="setEntryType('evening')"
            class="flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition"
            :class="entryType === 'evening' ? 'border-ink bg-ink text-paper' : 'border-border bg-paper text-ink hover:border-ink'"
          >
            <Moon class="h-5 w-5" />
            Soir
          </button>
          <button
            type="button"
            @click="setEntryType('school')"
            class="flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition"
            :class="entryType === 'school' ? 'border-slate bg-slate-soft text-slate' : 'border-border bg-paper text-ink hover:border-slate'"
          >
            <GraduationCap class="h-5 w-5" />
            Cours
          </button>
        </div>

        <template v-if="entryType === 'school'">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="schoolStart">Début</label>
              <input id="schoolStart" v-model="form.schoolStart" type="time" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="schoolEnd">Fin</label>
              <input id="schoolEnd" v-model="form.schoolEnd" type="time" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" />
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="schoolPause">Pause (min)</label>
            <input id="schoolPause" v-model.number="form.schoolPause" type="number" min="0" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" placeholder="ex: 60" />
          </div>
          <div v-if="schoolDuration !== null" class="text-sm text-ink-light">
            Durée nette : <span class="font-semibold text-ink">{{ formatMinutes(schoolDuration) }}</span>
          </div>
        </template>

        <template v-else>
          <div class="mb-2">
            <p class="mb-2 text-sm font-medium">Reprendre le dernier</p>
            <div class="grid grid-cols-2 gap-2">
              <button type="button" @click="copyLastService('morning')" class="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-paper px-3 py-2.5 text-sm font-medium text-ink transition hover:border-border-strong hover:bg-cream">
                <Sun class="h-4 w-4" />
                Matin
              </button>
              <button type="button" @click="copyLastService('evening')" class="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-paper px-3 py-2.5 text-sm font-medium text-ink transition hover:border-border-strong hover:bg-cream">
                <Moon class="h-4 w-4" />
                Soir
              </button>
            </div>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium" for="startTime">Début</label>
            <input id="startTime" v-model="form.startTime" type="time" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" required />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="endTime">Fin</label>
            <input id="endTime" v-model="form.endTime" type="time" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" required />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="breakMinutes">Pause (min)</label>
            <input id="breakMinutes" v-model.number="form.breakMinutes" type="number" min="0" class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light" placeholder="ex: 45" />
            <p class="mt-1.5 text-xs text-ink-muted">Par défaut : {{ defaultBreak }} min</p>
          </div>
        </template>

        <button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-clay py-3.5 font-semibold text-white transition hover:bg-clay-dark">
          <Plus class="h-5 w-5" />
          Ajouter
        </button>

        <p v-if="err" class="flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-4 text-sm font-medium text-terracotta">
          <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
          {{ err }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import { api } from '../api';
import { CheckCircle2, GraduationCap, Moon, Plus, Sun, TriangleAlert, X } from '@lucide/vue';

const props = defineProps({ isOpen: Boolean, defaultBreak: { type: Number, default: 45 } });
const emit = defineEmits(['close', 'added']);

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

const err = ref('');
const prefillMessage = ref('');

const entryType = computed(() => form.value.isSchoolDay ? 'school' : form.value.service);

const schoolDuration = computed(() => {
  if (!form.value.isSchoolDay) return null;
  if (!form.value.schoolStart || !form.value.schoolEnd) return null;
  const [h1, m1] = form.value.schoolStart.split(':').map(Number);
  const [h2, m2] = form.value.schoolEnd.split(':').map(Number);
  let mins = (h2 * 60 + m2) - (h1 * 60 + m1) - (form.value.schoolPause || 0);
  if (mins < 0) mins += 24 * 60;
  return mins;
});

function setEntryType(type) {
  if (type === 'school') {
    form.value.isSchoolDay = true;
    form.value.service = 'full';
  } else {
    form.value.isSchoolDay = false;
    form.value.service = type;
    if (!form.value.breakMinutes) form.value.breakMinutes = props.defaultBreak;
  }
}

function formatMinutes(mins) {
  const h = Math.floor(mins / 60);
  const mm = String(mins % 60).padStart(2, '0');
  return `${h}h${mm}`;
}

async function copyLastService(serviceType) {
  err.value = '';
  prefillMessage.value = '';
  try {
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const { data } = await api.get('/entries', { params: { start: startDate, end: endDate } });
    const matchingEntries = data.filter(e => !e.isSchoolDay && e.service === serviceType);
    if (matchingEntries.length === 0) {
      err.value = `Aucun service ${serviceType === 'morning' ? 'matin' : 'soir'} trouvé dans les 30 derniers jours`;
      setTimeout(() => { err.value = ''; }, 3000);
      return;
    }
    const lastEntry = matchingEntries[matchingEntries.length - 1];
    form.value.service = lastEntry.service;
    form.value.startTime = lastEntry.startTime || '';
    form.value.endTime = lastEntry.endTime || '';
    form.value.breakMinutes = lastEntry.breakMinutes || props.defaultBreak;
    form.value.isSchoolDay = false;
    prefillMessage.value = `Copié du ${dayjs(lastEntry.date).format('DD/MM/YYYY')} : ${lastEntry.service === 'morning' ? 'Matin' : 'Soir'} ${lastEntry.startTime}-${lastEntry.endTime}`;
    setTimeout(() => { prefillMessage.value = ''; }, 5000);
  } catch (e) {
    err.value = 'Erreur lors de la copie';
    setTimeout(() => { err.value = ''; }, 3000);
  }
}

async function submit() {
  err.value = '';
  try {
    const payload = { ...form.value };
    if (payload.isSchoolDay) {
      delete payload.service;
      delete payload.startTime;
      delete payload.endTime;
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
        payload.breakMinutes = props.defaultBreak;
      }
    }
    await api.post('/entries', payload);
    emit('added');
    close();
    resetForm();
  } catch (e) {
    err.value = e?.response?.data?.error || 'Erreur';
  }
}

function resetForm() {
  form.value = {
    date: dayjs().format('YYYY-MM-DD'),
    service: 'morning',
    startTime: '',
    endTime: '',
    isSchoolDay: false,
    schoolStart: '',
    schoolEnd: '',
    schoolPause: 60,
    breakMinutes: props.defaultBreak,
  };
}

function close() {
  emit('close');
}
</script>
