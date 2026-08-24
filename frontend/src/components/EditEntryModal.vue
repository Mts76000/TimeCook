<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" @click.self="close">
      <div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-paper sm:rounded-xl" @click.stop>
        <div class="sticky top-0 flex items-center justify-between border-b border-border bg-paper px-4 py-3 sm:px-6">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <Pencil class="h-5 w-5 text-clay" />
            Modifier l’entrée
          </h2>
          <button @click="close" class="grid h-9 w-9 place-items-center rounded-md text-ink-light transition hover:bg-cream hover:text-ink" aria-label="Fermer">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveEdit" class="space-y-4 p-4 sm:p-6">
          <div>
            <label class="mb-1.5 block text-sm font-medium" for="editDate">Date</label>
            <input
              id="editDate"
              v-model="editForm.date"
              type="date"
              class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
              required
            />
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              @click="setEditType('morning')"
              class="flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition"
              :class="editType === 'morning' ? 'border-clay bg-clay-light text-clay-dark' : 'border-border bg-paper text-ink hover:border-clay'"
            >
              <Sun class="h-5 w-5" />
              Matin
            </button>
            <button
              type="button"
              @click="setEditType('evening')"
              class="flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition"
              :class="editType === 'evening' ? 'border-ink bg-ink text-paper' : 'border-border bg-paper text-ink hover:border-ink'"
            >
              <Moon class="h-5 w-5" />
              Soir
            </button>
            <button
              type="button"
              @click="setEditType('school')"
              class="flex flex-col items-center gap-1 rounded-md border p-3 text-sm font-medium transition"
              :class="editType === 'school' ? 'border-slate bg-slate-soft text-slate' : 'border-border bg-paper text-ink hover:border-slate'"
            >
              <GraduationCap class="h-5 w-5" />
              Cours
            </button>
          </div>

          <template v-if="editType === 'school'">
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="editSchoolHours">Heures de cours</label>
              <input
                id="editSchoolHours"
                v-model.number="editForm.schoolHours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
                placeholder="ex: 7"
              />
              <p class="mt-1.5 text-xs text-ink-muted">Durée totale en heures, pauses déduites.</p>
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1.5 block text-sm font-medium" for="editStart">Début</label>
                <input
                  id="editStart"
                  v-model="editForm.startTime"
                  type="time"
                  class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
                  required
                />
              </div>
              <div>
                <label class="mb-1.5 block text-sm font-medium" for="editEnd">Fin</label>
                <input
                  id="editEnd"
                  v-model="editForm.endTime"
                  type="time"
                  class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
                  required
                />
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium" for="editBreak">Pause (min)</label>
              <input
                id="editBreak"
                v-model.number="editForm.breakMinutes"
                type="number"
                min="0"
                class="h-12 w-full rounded-md border border-border bg-cream px-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay-light"
                placeholder="ex: 45"
              />
            </div>
          </template>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="close"
              class="flex-1 rounded-md border border-border bg-paper py-3 font-medium text-ink transition hover:bg-cream"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-clay py-3 font-semibold text-white transition hover:bg-clay-dark"
            >
              <Save class="h-4 w-4" />
              Enregistrer
            </button>
          </div>

          <p v-if="error" class="flex items-start gap-2 rounded-md border border-terracotta bg-terracotta-soft p-3 text-sm font-medium text-terracotta">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ error }}
          </p>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import { api } from '../api';
import { GraduationCap, Moon, Pencil, Save, Sun, TriangleAlert, X } from '@lucide/vue';

const props = defineProps({
  isOpen: Boolean,
  entry: Object,
});

const emit = defineEmits(['close', 'saved']);

const editForm = ref({
  date: '',
  service: 'morning',
  startTime: '',
  endTime: '',
  breakMinutes: null,
  isSchoolDay: false,
  schoolHours: null,
});

const error = ref('');
const isInitializing = ref(false);

const editType = computed(() => editForm.value.isSchoolDay ? 'school' : editForm.value.service);

function setEditType(type) {
  if (type === 'school') {
    editForm.value.isSchoolDay = true;
    editForm.value.service = 'full';
  } else {
    editForm.value.isSchoolDay = false;
    editForm.value.service = type;
  }
}

watch(() => props.entry, (newEntry) => {
  if (newEntry) {
    isInitializing.value = true;
    editForm.value = {
      date: newEntry.date || '',
      service: newEntry.service || 'morning',
      startTime: newEntry.startTime || '',
      endTime: newEntry.endTime || '',
      breakMinutes: newEntry.breakMinutes ?? null,
      isSchoolDay: newEntry.isSchoolDay || false,
      schoolHours: newEntry.schoolHours ?? null,
    };
    nextTick(() => { isInitializing.value = false; });
  }
}, { immediate: true });

async function prefillFromLast(serviceType) {
  try {
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const { data } = await api.get('/entries', { params: { start: startDate, end: endDate } });
    const matching = data.filter(e => !e.isSchoolDay && e.service === serviceType);
    if (matching.length === 0) {
      editForm.value.startTime = '';
      editForm.value.endTime = '';
      return;
    }
    const last = matching[matching.length - 1];
    editForm.value.startTime = last.startTime || '';
    editForm.value.endTime = last.endTime || '';
    if (last.breakMinutes != null) {
      editForm.value.breakMinutes = last.breakMinutes;
    }
  } catch (e) {
    console.error('Prefill error', e);
  }
}

watch(() => editForm.value.service, (newService, oldService) => {
  if (isInitializing.value) return;
  if (editForm.value.isSchoolDay) return;
  if (!newService || newService === oldService) return;
  if (newService === 'full') {
    editForm.value.startTime = '';
    editForm.value.endTime = '';
  } else if (newService === 'morning' || newService === 'evening') {
    prefillFromLast(newService);
  }
});

function close() {
  error.value = '';
  emit('close');
}

async function saveEdit() {
  error.value = '';
  try {
    const payload = { ...editForm.value };
    if (payload.isSchoolDay) {
      delete payload.service;
      delete payload.startTime;
      delete payload.endTime;
      delete payload.breakMinutes;
    } else {
      delete payload.schoolHours;
    }
    await api.put(`/entries/${props.entry._id}`, payload);
    emit('saved');
    close();
  } catch (e) {
    error.value = e?.response?.data?.error || 'Erreur lors de la modification';
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.25s ease;
}

.modal-enter-from > div {
  transform: translateY(100%);
}

.modal-leave-to > div {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from > div,
  .modal-leave-to > div {
    transform: scale(0.96) translateY(8px);
  }
}
</style>
