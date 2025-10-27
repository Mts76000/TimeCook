<template>
  <div class="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 text-gray-900">
    <!-- Header -->
    <header class="px-4 sm:px-6 py-4 sm:py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">⏰</span>
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900">TimeCook</h1>
        </div>
        <button @click="$emit('go-to-auth')" class="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition shadow-sm">
          Se connecter
        </button>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="px-4 sm:px-6 py-12 sm:py-20">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl sm:text-5xl font-bold mb-6 leading-tight text-gray-900">
          Suivez vos heures d'alternance<br/>
          <span class="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-600">simplement et rapidement</span>
        </h2>
        <p class="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Conçu pour les alternants en restauration. Gérez vos services, vos jours de cours et suivez vos objectifs mensuels en un coup d'œil.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button @click="$emit('go-to-auth')" class="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-lg transition shadow-lg">
            Commencer gratuitement
          </button>
          <button @click="scrollToFeatures" class="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-lg font-semibold text-lg transition border-2 border-gray-200">
            En savoir plus
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="px-4 sm:px-6 py-12 sm:py-16 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <h3 class="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-900">Pourquoi TimeCook ?</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <!-- Feature 1 -->
          <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-4xl mb-4">⚡</div>
            <h4 class="text-xl font-semibold mb-3 text-gray-900">Saisie rapide</h4>
            <p class="text-gray-600">
              Ajoutez vos heures de service (matin/soir) ou vos jours de cours en quelques secondes. Interface mobile-first pour saisir en déplacement.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-4xl mb-4">📊</div>
            <h4 class="text-xl font-semibold mb-3 text-gray-900">Suivi automatique</h4>
            <p class="text-gray-600">
              Visualisez vos heures par semaine ou par mois. Comparez avec vos objectifs (35h/semaine, 152h/mois) et voyez vos heures sup'.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
            <div class="text-4xl mb-4">🎯</div>
            <h4 class="text-xl font-semibold mb-3 text-gray-900">Objectifs clairs</h4>
            <p class="text-gray-600">
              Navigation simple entre les semaines et les mois. Exportez vos données en CSV pour les transmettre à votre entreprise.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="px-4 sm:px-6 py-12 sm:py-16 bg-white">
      <div class="max-w-4xl mx-auto">
        <h3 class="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-900">Comment ça marche ?</h3>
        
        <div class="space-y-8">
          <div class="flex gap-4 items-start">
            <div class="shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">1</div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Créez votre compte gratuitement</h4>
              <p class="text-gray-600">En quelques secondes, avec juste votre email.</p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">2</div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Ajoutez vos heures chaque jour</h4>
              <p class="text-gray-600">Service du matin (9h-14h), du soir (18h-23h) ou journée d'école. Les calculs se font automatiquement avec les pauses.</p>
            </div>
          </div>

          <div class="flex gap-4 items-start">
            <div class="shrink-0 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">3</div>
            <div>
              <h4 class="text-xl font-semibold mb-2 text-gray-900">Consultez vos statistiques</h4>
              <p class="text-gray-600">Vue hebdomadaire et mensuelle, avec objectifs et heures supplémentaires calculés.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="px-4 sm:px-6 py-12 sm:py-20 bg-linear-to-r from-orange-500 to-orange-600">
      <div class="max-w-4xl mx-auto text-center">
        <h3 class="text-3xl sm:text-4xl font-bold mb-4 text-white">Prêt à simplifier votre suivi d'heures ?</h3>
        <p class="text-lg sm:text-xl mb-8 text-white/90">
          Rejoignez TimeCook et ne perdez plus jamais le fil de vos heures.
        </p>
        <button @click="$emit('go-to-auth')" class="px-8 py-4 bg-white text-orange-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
          Commencer maintenant
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="px-4 sm:px-6 py-8 bg-gray-50 border-t border-gray-200">
      <div class="max-w-6xl mx-auto text-center text-gray-600 text-sm">
        <p>© 2025 TimeCook - Suivi d'heures pour alternants</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['go-to-auth']);

const featuresSection = ref(null);

function scrollToFeatures() {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
}
</script>
