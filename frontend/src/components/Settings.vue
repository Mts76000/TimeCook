<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-10 border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$emit('back')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">Paramètres</h1>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <!-- Objectifs Section -->
      <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h2 class="text-xl font-semibold mb-6 text-gray-900">
          Objectifs personnalisables
        </h2>
        
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
            class="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-all duration-200 shadow-sm"
          >
            Sauvegarder les objectifs
          </button>

          <Transition name="success">
            <p v-if="objectivesSuccess" class="text-green-600 text-sm bg-green-50 p-4 rounded-xl font-medium">
              ✓ Objectifs sauvegardés avec succès !
            </p>
          </Transition>
          
          <p v-if="objectivesError" class="text-red-600 text-sm bg-red-50 p-4 rounded-xl font-medium">
            ❌ {{ objectivesError }}
          </p>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api';

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
