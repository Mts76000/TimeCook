<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
      <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            ✏️ Modifier l'entrée
          </h2>
          <button @click="close" class="text-gray-500 hover:text-gray-700 transition-colors text-2xl leading-none">
            ×
          </button>
        </div>

        <form @submit.prevent="saveEdit" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Date</label>
            <input 
              v-model="editForm.date" 
              type="date" 
              class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500" 
              required 
            />
          </div>

          <div class="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
            <label class="text-sm font-medium cursor-pointer flex items-center gap-2">
              <input type="checkbox" v-model="editForm.isSchoolDay" class="w-4 h-4 accent-orange-500" />
              📚 Jour de cours
            </label>
          </div>

          <template v-if="editForm.isSchoolDay">
            <div>
              <label class="block text-sm font-medium mb-2">Heures de cours</label>
              <input 
                v-model.number="editForm.schoolHours" 
                type="number" 
                min="0" 
                max="24"
                step="0.5"
                class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="ex: 7"
              />
              <p class="text-xs text-gray-500 mt-1">Durée totale en heures (déjà déduit les pauses)</p>
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">Service</label>
                <select v-model="editForm.service" class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="morning">🌅 Matin</option>
                  <option value="evening">🌙 Soir</option>
                  <option value="full">📅 Autre</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">Début</label>
                <input 
                  v-model="editForm.startTime" 
                  type="time" 
                  class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  required 
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Fin</label>
              <input 
                v-model="editForm.endTime" 
                type="time" 
                class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500" 
                required 
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Pause (minutes)</label>
              <input 
                v-model.number="editForm.breakMinutes" 
                type="number" 
                min="0" 
                class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="ex: 45" 
              />
            </div>
          </template>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="close"
              class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              💾 Enregistrer
            </button>
          </div>

          <p v-if="error" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            ❌ {{ error }}
          </p>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import dayjs from 'dayjs';
import { api } from '../api';

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

// Watch for entry changes to populate form
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

// Prefill start/end/break from the last similar service within the last 30 days
async function prefillFromLast(serviceType) {
  try {
    const endDate = dayjs().format('YYYY-MM-DD');
    const startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const { data } = await api.get('/entries', { params: { start: startDate, end: endDate } });
    const matching = data.filter(e => !e.isSchoolDay && e.service === serviceType);
    if (matching.length === 0) {
      // No previous entry: clear times to avoid keeping morning hours
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
    // Silent fail: do not block user
    console.error('Prefill error', e);
  }
}

// When the service changes in edit mode, adjust the times accordingly
watch(() => editForm.value.service, (newService, oldService) => {
  if (isInitializing.value) return;
  if (editForm.value.isSchoolDay) return;
  if (!newService || newService === oldService) return;
  if (newService === 'full') {
    // Custom: clear to force user to set
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
      // Remove service fields for school day
      delete payload.service;
      delete payload.startTime;
      delete payload.endTime;
      delete payload.breakMinutes;
    } else {
      // Remove school fields for work day
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
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div {
  transform: scale(0.9) translateY(-20px);
}

.modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
}
</style>
