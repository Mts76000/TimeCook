<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center text-ink">
    <img src="/logo.jpeg" alt="TimeCook" class="h-16 w-16 object-cover" />
    <h1 class="mt-6 text-6xl font-semibold tracking-tight">404</h1>
    <p class="mt-2 text-xl text-ink-light">Cette page n’existe pas.</p>
    <router-link to="/" class="mt-8 inline-flex items-center gap-2 rounded-md bg-clay px-6 py-3 font-semibold text-white transition hover:bg-clay-dark">
      <ArrowLeft class="h-5 w-5" />
      Retour à l’accueil
    </router-link>
  </div>
</template>

<script setup>
import { ArrowLeft } from '@lucide/vue';
</script>
