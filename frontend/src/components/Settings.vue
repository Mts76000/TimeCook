<template>
  <div class="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
    <header class="bg-white shadow sticky top-0 z-10 border-b border-orange-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$emit('back')" class="text-gray-600 hover:text-gray-800 transition-colors">
            ← Retour
          </button>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-800">⚙️ Paramètres</h1>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <!-- Objectifs Section -->
      <section class="bg-white shadow-lg rounded-xl p-6 border border-orange-100">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          🎯 Objectifs personnalisables
        </h2>
        
        <form @submit.prevent="saveObjectives" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Objectif hebdomadaire (heures)</label>
            <input 
              v-model.number="objectives.weeklyTargetHours" 
              type="number" 
              min="1" 
              max="168"
              step="0.5"
              class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required 
            />
            <p class="text-xs text-gray-500 mt-1">Par défaut: 35h</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Objectif mensuel (heures)</label>
            <input 
              v-model.number="objectives.monthlyTargetHours" 
              type="number" 
              min="1" 
              max="744"
              step="0.5"
              class="w-full border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required 
            />
            <p class="text-xs text-gray-500 mt-1">Par défaut: 152h</p>
          </div>

          <button 
            type="submit" 
            class="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          >
            💾 Sauvegarder les objectifs
          </button>

          <Transition name="success">
            <p v-if="objectivesSuccess" class="text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200 animate-pulse">
              ✓ Objectifs sauvegardés avec succès !
            </p>
          </Transition>
          
          <p v-if="objectivesError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
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
  animation: bounce-in 0.5s;
}
.success-leave-active {
  animation: bounce-out 0.3s;
}

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounce-out {
  to { transform: scale(0); opacity: 0; }
}
</style>
