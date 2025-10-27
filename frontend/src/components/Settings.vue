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

      <!-- Partage Section -->
      <section class="bg-white shadow-lg rounded-xl p-6 border border-orange-100">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
          👥 Partage des heures
        </h2>
        
        <p class="text-sm text-gray-600 mb-4">
          Partagez vos heures en lecture seule avec d'autres personnes. Ils pourront voir vos entrées sans pouvoir les modifier.
        </p>

        <!-- Add email form -->
        <form @submit.prevent="addShareEmail" class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium mb-2">Email à ajouter</label>
            <div class="flex gap-2">
              <input 
                v-model="newShareEmail" 
                type="email" 
                placeholder="exemple@email.com"
                class="flex-1 border border-gray-300 rounded-lg px-3 h-11 text-[16px] focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                required 
              />
              <button 
                type="submit" 
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                ➕ Ajouter
              </button>
            </div>
          </div>

          <Transition name="success">
            <p v-if="shareSuccess" class="text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200 animate-pulse">
              ✓ {{ shareSuccess }}
            </p>
          </Transition>
          
          <p v-if="shareError" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
            ❌ {{ shareError }}
          </p>
        </form>

        <!-- Shared emails list -->
        <div v-if="sharedEmails.length > 0" class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Partagé avec :</h3>
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <div 
              v-for="email in sharedEmails" 
              :key="email"
              class="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all"
            >
              <span class="text-sm font-medium text-gray-800">{{ email }}</span>
              <button 
                @click="removeShareEmail(email)"
                class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors hover:scale-110 transform"
              >
                🗑️ Retirer
              </button>
            </div>
          </TransitionGroup>
        </div>
        <p v-else class="text-sm text-gray-500 italic">
          Aucun partage actif pour le moment
        </p>

        <!-- Share link -->
        <div v-if="shareLink" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">🔗 Lien de partage :</h3>
          <div class="flex gap-2">
            <input 
              :value="shareLink" 
              readonly 
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white font-mono"
            />
            <button 
              @click="copyShareLink"
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              📋 Copier
            </button>
          </div>
          <Transition name="success">
            <p v-if="linkCopied" class="text-green-700 text-xs mt-2 animate-pulse">
              ✓ Lien copié !
            </p>
          </Transition>
        </div>
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

// Sharing
const newShareEmail = ref('');
const sharedEmails = ref([]);
const shareSuccess = ref('');
const shareError = ref('');
const shareLink = ref('');
const linkCopied = ref(false);

async function loadSettings() {
  try {
    const { data } = await api.get('/settings');
    objectives.value.weeklyTargetHours = data.weeklyTargetHours || 35;
    objectives.value.monthlyTargetHours = data.monthlyTargetHours || 152;
    sharedEmails.value = data.sharedWithEmails || [];
    
    // Generate share link avec l'ID utilisateur
    const { data: userData } = await api.get('/auth/me');
    const userId = userData.user._id;
    shareLink.value = `${window.location.origin}/shared/${userId}`;
  } catch (e) {
    console.error('Erreur lors du chargement des paramètres:', e);
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
    setTimeout(() => {
      objectivesSuccess.value = false;
    }, 3000);
  } catch (e) {
    objectivesError.value = e?.response?.data?.error || 'Erreur lors de la sauvegarde';
    setTimeout(() => {
      objectivesError.value = '';
    }, 5000);
  }
}

async function addShareEmail() {
  shareSuccess.value = '';
  shareError.value = '';
  
  if (!newShareEmail.value) return;
  
  try {
    await api.post('/settings/share', {
      email: newShareEmail.value.toLowerCase().trim(),
    });
    
    await loadSettings();
    shareSuccess.value = `${newShareEmail.value} ajouté avec succès !`;
    newShareEmail.value = '';
    
    setTimeout(() => {
      shareSuccess.value = '';
    }, 3000);
  } catch (e) {
    shareError.value = e?.response?.data?.error || 'Erreur lors de l\'ajout';
    setTimeout(() => {
      shareError.value = '';
    }, 5000);
  }
}

async function removeShareEmail(email) {
  if (!confirm(`Retirer l'accès pour ${email} ?`)) return;
  
  try {
    await api.delete(`/settings/share/${encodeURIComponent(email)}`);
    await loadSettings();
  } catch (e) {
    shareError.value = e?.response?.data?.error || 'Erreur lors de la suppression';
    setTimeout(() => {
      shareError.value = '';
    }, 5000);
  }
}

function copyShareLink() {
  navigator.clipboard.writeText(shareLink.value);
  linkCopied.value = true;
  setTimeout(() => {
    linkCopied.value = false;
  }, 2000);
}

onMounted(() => {
  loadSettings();
});
</script>

<style scoped>
/* Success animation */
.success-enter-active {
  animation: bounce-in 0.5s;
}
.success-leave-active {
  animation: bounce-out 0.3s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-out {
  to {
    transform: scale(0);
    opacity: 0;
  }
}

/* List animation */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
