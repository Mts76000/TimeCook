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
          👥 Partage sécurisé
        </h2>
        
        <p class="text-sm text-gray-600 mb-4">
          Partagez vos heures en lecture seule avec d'autres personnes. Chaque personne reçoit un lien sécurisé unique.
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

        <!-- Shared list -->
        <div v-if="sharedWith.length > 0" class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-700">Partagé avec :</h3>
          <TransitionGroup name="list" tag="div" class="space-y-2">
            <div 
              v-for="share in sharedWith" 
              :key="share.email"
              class="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-800">{{ share.email }}</span>
                <button 
                  @click="removeShareEmail(share.email)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium transition-colors hover:scale-110 transform"
                >
                  🗑️ Retirer
                </button>
              </div>
              <button 
                @click="copyShareLinkFor(share)"
                class="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                📋 Copier le lien pour {{ share.email.split('@')[0] }}
              </button>
              <Transition name="success">
                <p v-if="linkCopied === share.email" class="text-green-600 text-xs mt-1">
                  ✓ Lien copié !
                </p>
              </Transition>
            </div>
          </TransitionGroup>
        </div>
        <p v-else class="text-sm text-gray-500 italic">
          Aucun partage actif pour le moment
        </p>

        <!-- Instructions -->
        <div v-if="sharedWith.length > 0" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 class="text-sm font-semibold text-gray-700 mb-2">📧 Comment ça marche ?</h3>
          <ol class="text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li>Ajoutez l'email de la personne ci-dessus</li>
            <li>Cliquez sur "📋 Copier le lien" à côté de son email</li>
            <li>Envoyez-lui le lien par WhatsApp, SMS, email, etc.</li>
            <li>Elle peut accéder directement avec son lien unique 🔐</li>
          </ol>
          <p class="text-xs text-gray-600 mt-2 italic">
            ✨ Chaque personne a un lien sécurisé unique. Vous pouvez révoquer l'accès à tout moment.
          </p>
        </div>

        <div v-else class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-600 text-center">
            💡 Ajoutez un email ci-dessus pour générer un lien de partage sécurisé
          </p>
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
const sharedWith = ref([]);
const shareSuccess = ref('');
const shareError = ref('');
const linkCopied = ref('');
const userId = ref('');

async function loadSettings() {
  try {
    const { data } = await api.get('/settings');
    objectives.value.weeklyTargetHours = data.weeklyTargetHours || 35;
    objectives.value.monthlyTargetHours = data.monthlyTargetHours || 152;
    sharedWith.value = data.sharedWith || [];
    
    const { data: userData } = await api.get('/auth/me');
    userId.value = userData.user._id;
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

async function addShareEmail() {
  shareSuccess.value = '';
  shareError.value = '';
  
  if (!newShareEmail.value) return;
  
  try {
    await api.post('/settings/share', {
      email: newShareEmail.value.toLowerCase().trim(),
    });
    
    await loadSettings();
    shareSuccess.value = `${newShareEmail.value} ajouté !`;
    newShareEmail.value = '';
    
    setTimeout(() => { shareSuccess.value = ''; }, 3000);
  } catch (e) {
    shareError.value = e?.response?.data?.error || 'Erreur';
    setTimeout(() => { shareError.value = ''; }, 5000);
  }
}

async function removeShareEmail(email) {
  if (!confirm(`Retirer l'accès pour ${email} ?`)) return;
  
  try {
    await api.delete(`/settings/share/${encodeURIComponent(email)}`);
    await loadSettings();
  } catch (e) {
    shareError.value = e?.response?.data?.error || 'Erreur';
    setTimeout(() => { shareError.value = ''; }, 5000);
  }
}

function copyShareLinkFor(share) {
  const link = `${window.location.origin}/shared/${userId.value}?token=${share.token}`;
  navigator.clipboard.writeText(link);
  linkCopied.value = share.email;
  setTimeout(() => { linkCopied.value = ''; }, 2000);
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
