<template>
  <div class="min-h-screen bg-[#fbfaf8] text-slate-900">
    <header class="sticky top-0 z-20 border-b border-orange-100 bg-white/90 backdrop-blur-xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-lg bg-orange-500 text-white shadow-sm shadow-orange-500/20">
            <ChefHat class="h-5 w-5" />
          </span>
          <div>
            <h1 class="text-lg font-semibold leading-none text-slate-900">TimeCook</h1>
            <p class="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">Suivi d'heures</p>
          </div>
        </div>
        <button @click="$emit('go-to-auth')" class="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600">
          Se connecter
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </header>

    <section class="border-b border-orange-100 bg-[#fff8f1]">
      <div class="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:py-20">
        <div>
          <p class="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1 text-sm font-medium text-orange-700">
            <Sparkles class="h-4 w-4" />
            Pensé pour les alternants en restauration
          </p>
          <h2 class="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl">
            Suivez vos heures sans vous battre avec un tableau.
          </h2>
          <p class="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TimeCook vous aide à noter vos services, vos cours et vos pauses, puis calcule vos objectifs semaine après semaine.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button @click="$emit('go-to-auth')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600">
              Commencer
              <ArrowRight class="h-5 w-5" />
            </button>
            <button @click="scrollToFeatures" class="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50">
              Voir les fonctions
              <ChevronDown class="h-5 w-5" />
            </button>
          </div>

          <div class="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
            <span class="rounded-full border border-orange-100 bg-white px-3 py-1.5">Services matin et soir</span>
            <span class="rounded-full border border-orange-100 bg-white px-3 py-1.5">Jours de cours</span>
            <span class="rounded-full border border-orange-100 bg-white px-3 py-1.5">Export CSV</span>
          </div>
        </div>

        <div class="rounded-2xl border border-orange-100 bg-white p-4 shadow-xl shadow-orange-900/5">
          <div class="rounded-xl border border-slate-100 bg-white p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-sm font-medium text-slate-500">Cette semaine</p>
                <p class="mt-1 text-3xl font-semibold text-slate-950">32h15</p>
              </div>
              <span class="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">Objectif 35h</span>
            </div>

            <div class="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full w-[92%] rounded-full bg-orange-500"></div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-3">
              <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Total</p>
                <p class="mt-1 font-semibold text-slate-900">32h15</p>
              </div>
              <div class="rounded-lg border border-orange-100 bg-orange-50 p-3">
                <p class="text-xs font-medium uppercase tracking-wide text-orange-600">Reste</p>
                <p class="mt-1 font-semibold text-orange-700">2h45</p>
              </div>
              <div class="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Pause</p>
                <p class="mt-1 font-semibold text-slate-900">1h30</p>
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3">
                <span class="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-600"><Sun class="h-4 w-4" /></span>
                <div>
                  <p class="font-medium text-slate-900">Service matin</p>
                  <p class="text-sm text-slate-500">Pause incluse</p>
                </div>
                <span class="font-mono text-sm text-slate-700">09:00 - 14:00</span>
              </div>
              <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3">
                <span class="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600"><Moon class="h-4 w-4" /></span>
                <div>
                  <p class="font-medium text-slate-900">Service soir</p>
                  <p class="text-sm text-slate-500">Horaires copiables</p>
                </div>
                <span class="font-mono text-sm text-slate-700">18:00 - 23:30</span>
              </div>
              <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-orange-100 bg-orange-50 px-4 py-3">
                <span class="grid h-9 w-9 place-items-center rounded-lg bg-white text-orange-600"><GraduationCap class="h-4 w-4" /></span>
                <div>
                  <p class="font-medium text-slate-900">Jour de cours</p>
                  <p class="text-sm text-slate-500">Ajouté au résumé</p>
                </div>
                <span class="font-semibold text-orange-700">7h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section ref="featuresSection" class="bg-white px-4 py-14 sm:px-6 sm:py-16">
      <div class="mx-auto max-w-6xl">
        <div class="mb-8 max-w-2xl">
          <p class="text-sm font-semibold uppercase tracking-wide text-orange-600">Fonctions</p>
          <h3 class="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Simple, mais précis.</h3>
          <p class="mt-3 leading-7 text-slate-600">L'essentiel pour suivre une alternance sans interface chargée.</p>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-600">
              <Zap class="h-5 w-5" />
            </div>
            <h4 class="text-lg font-semibold text-slate-950">Saisie rapide</h4>
            <p class="mt-3 leading-7 text-slate-600">
              Ajoutez un service ou un jour de cours en quelques champs, avec les pauses prises en compte.
            </p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-600">
              <ChartNoAxesColumnIncreasing class="h-5 w-5" />
            </div>
            <h4 class="text-lg font-semibold text-slate-950">Résumé clair</h4>
            <p class="mt-3 leading-7 text-slate-600">
              Visualisez le total, l'objectif et le reste à faire sur la semaine ou le mois.
            </p>
          </div>

          <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-orange-600">
              <FileDown class="h-5 w-5" />
            </div>
            <h4 class="text-lg font-semibold text-slate-950">Export propre</h4>
            <p class="mt-3 leading-7 text-slate-600">
              Exportez vos données en CSV pour les transmettre ou les archiver.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-orange-100 bg-[#fff8f1] px-4 py-14 sm:px-6 sm:py-16">
      <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-orange-600">Routine</p>
          <h3 class="mt-2 text-3xl font-semibold tracking-normal text-slate-950">Un suivi qui reste lisible.</h3>
          <p class="mt-4 leading-7 text-slate-600">Pas besoin d'une interface compliquée pour garder une trace fiable.</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-orange-100 bg-white p-5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 font-semibold text-white">1</span>
            <h4 class="mt-5 font-semibold text-slate-950">Créer le compte</h4>
            <p class="mt-2 text-sm leading-6 text-slate-600">Votre suivi est disponible partout.</p>
          </div>

          <div class="rounded-xl border border-orange-100 bg-white p-5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 font-semibold text-white">2</span>
            <h4 class="mt-5 font-semibold text-slate-950">Ajouter la journée</h4>
            <p class="mt-2 text-sm leading-6 text-slate-600">Services, cours, pauses et horaires.</p>
          </div>

          <div class="rounded-xl border border-orange-100 bg-white p-5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 font-semibold text-white">3</span>
            <h4 class="mt-5 font-semibold text-slate-950">Exporter</h4>
            <p class="mt-2 text-sm leading-6 text-slate-600">Un CSV clair quand il faut justifier.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white px-4 py-14 sm:px-6">
      <div class="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl border border-orange-100 bg-[#fff8f1] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 class="text-3xl font-semibold tracking-normal text-slate-950">Prêt à suivre vos heures proprement ?</h3>
          <p class="mt-2 max-w-2xl text-slate-600">
            Commencez avec une interface calme, lisible et faite pour les semaines irrégulières.
          </p>
        </div>
        <button @click="$emit('go-to-auth')" class="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-sm shadow-orange-500/20 transition hover:bg-orange-600">
          Commencer
          <ArrowRight class="h-5 w-5" />
        </button>
      </div>
    </section>

    <footer class="border-t border-slate-200 bg-white px-4 py-8 sm:px-6">
      <div class="mx-auto flex max-w-6xl flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 TimeCook - Suivi d'heures pour alternants</p>
        <p class="font-medium text-slate-500">Simple, clair, sans surcharge.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  ArrowRight,
  ChartNoAxesColumnIncreasing,
  ChefHat,
  ChevronDown,
  FileDown,
  GraduationCap,
  Moon,
  Sparkles,
  Sun,
  Zap,
} from '@lucide/vue';

defineEmits(['go-to-auth']);

const featuresSection = ref(null);

function scrollToFeatures() {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
}
</script>
