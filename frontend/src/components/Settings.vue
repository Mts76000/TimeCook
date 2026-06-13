<template>
  <div class="min-h-screen bg-[#fff8f1]">
    <header class="sticky top-0 z-10 border-b border-orange-100/80 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button @click="$emit('back')" class="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50" aria-label="Retour">
            <ChevronLeft class="h-5 w-5" />
          </button>
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-orange-600">Compte</p>
            <h1 class="text-2xl font-semibold text-gray-950">Paramètres</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <section class="rounded-xl border border-orange-100 bg-white p-5 shadow-sm sm:p-8">
        <div class="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-950">Objectifs personnalisables</h2>
            <p class="mt-2 text-sm leading-6 text-gray-600">Ces valeurs servent au résumé hebdomadaire et mensuel.</p>
          </div>
          <Target class="h-5 w-5 text-orange-500" />
        </div>
        
        <form @submit.prevent="saveObjectives" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Objectif hebdomadaire (heures)</label>
            <input 
              v-model.number="objectives.weeklyTargetHours" 
              type="number" 
              min="1" 
              max="168"
              step="0.5"
              class="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required 
            />
            <p class="text-xs text-gray-500 mt-2">Par défaut: 35h</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Objectif mensuel (heures)</label>
            <input 
              v-model.number="objectives.monthlyTargetHours" 
              type="number" 
              min="1" 
              max="744"
              step="0.5"
              class="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required 
            />
            <p class="text-xs text-gray-500 mt-2">Par défaut: 152h</p>
          </div>

          <button 
            type="submit" 
            class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-3.5 font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Save class="h-4 w-4" />
            Sauvegarder les objectifs
          </button>

          <Transition name="success">
            <p v-if="objectivesSuccess" class="flex items-start gap-2 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
              <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />
              Objectifs sauvegardés avec succès.
            </p>
          </Transition>
          
          <p v-if="objectivesError" class="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
            <TriangleAlert class="mt-0.5 h-4 w-4 shrink-0" />
            {{ objectivesError }}
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api';
import { CheckCircle2, ChevronLeft, Save, Target, TriangleAlert } from '@lucide/vue';

const emit = defineEmits(['back']);

// Objectives
const objectives = ref({
  weeklyTargetHours: 35,
  monthlyTargetHours: 152,
});
const objectivesSuccess = ref(false);
const objectivesError = ref('');

async function loadSettings() {
  try {
    const { data } = await api.get('/settings');
    objectives.value.weeklyTargetHours = data.weeklyTargetHours || 35;
    objectives.value.monthlyTargetHours = data.monthlyTargetHours || 152;
  } catch (e) {
    console.error('Erreur:', e);
  }
}

async function saveObjectives() {
  objectivesSuccess.value = false;
  objectivesError.value = '';
  
  try {
    await api.patch('/settings', {
      weeklyTargetHours: objectives.value.weeklyTargetHours,
      monthlyTargetHours: objectives.value.monthlyTargetHours,
    });
    
    objectivesSuccess.value = true;
    setTimeout(() => { objectivesSuccess.value = false; }, 3000);
  } catch (e) {
    objectivesError.value = e?.response?.data?.error || 'Erreur';
    setTimeout(() => { objectivesError.value = ''; }, 5000);
  }
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
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

.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}
</style>
