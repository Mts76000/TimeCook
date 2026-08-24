<template>
  <div class="min-h-screen bg-cream text-ink">
    <header class="border-b border-border bg-paper">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="flex items-center gap-3">
          <img src="/logo.jpeg" alt="TimeCook" class="h-9 w-9 object-cover" />
          <div>
            <h1 class="text-lg font-semibold leading-tight">TimeCook</h1>
            <p class="text-xs text-ink-muted">Suivi d’heures</p>
          </div>
        </div>
        <button @click="$emit('go-to-auth')" class="inline-flex items-center gap-2 rounded-md border border-border bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:border-clay hover:text-clay">
          Se connecter
        </button>
      </div>
    </header>

    <main>
      <section class="border-b border-border px-4 py-12 sm:px-6 sm:py-20">
        <div class="mx-auto max-w-5xl">
          <p class="mb-5 inline-flex items-center gap-2 rounded-full border border-clay-light bg-clay-light px-3 py-1 text-sm font-medium text-clay-dark">
            Pensé pour les alternants en restauration
          </p>

          <h2 class="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Vos heures de service, vos cours, votre rythme — sans le bruit.
          </h2>

          <p class="mt-5 max-w-xl text-lg leading-relaxed text-ink-light">
            TimeCook note automatiquement vos heures, calcule vos objectifs et vous donne le bon chiffre au bon moment.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button @click="$emit('go-to-auth')" class="inline-flex items-center justify-center gap-2 rounded-md bg-clay px-6 py-3.5 font-semibold text-white transition hover:bg-clay-dark">
              Commencer
              <ArrowRight class="h-5 w-5" />
            </button>
            <button @click="scrollToFeatures" class="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-paper px-6 py-3.5 font-semibold text-ink transition hover:border-border-strong">
              Voir les fonctions
              <ChevronDown class="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section class="border-b border-border bg-paper px-4 py-12 sm:px-6 sm:py-16">
        <div class="mx-auto max-w-5xl">
          <div class="mb-6 flex items-baseline justify-between sm:mb-8">
            <div>
              <p class="text-sm font-semibold text-clay-dark">Aperçu</p>
              <h3 class="mt-1 text-2xl font-semibold tracking-tight">Votre semaine en un coup d’œil</h3>
            </div>
          </div>

          <div class="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 sm:pb-0">
            <div class="grid min-w-[560px] grid-cols-7 gap-2 sm:min-w-0 sm:gap-4">
              <div
                v-for="(day, i) in weekPreview"
                :key="i"
                class="flex flex-col gap-2 rounded-lg border p-3 sm:p-4"
                :class="day.highlight ? 'border-clay bg-clay-light' : 'border-border bg-paper'"
              >
                <span class="text-[10px] font-medium uppercase tracking-wide text-ink-muted sm:text-xs">{{ day.label }}</span>
                <div class="space-y-1.5">
                  <div
                    v-for="(block, j) in day.blocks"
                    :key="j"
                    class="rounded px-1.5 py-1 text-[10px] font-medium sm:text-xs"
                    :class="block.type === 'work' ? 'bg-slate-soft text-slate' : 'bg-olive-soft text-olive'"
                  >
                    {{ block.text }}
                  </div>
                </div>
                <div v-if="day.total" class="mt-auto pt-2 text-sm font-semibold">
                  {{ day.total }}
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
            <div class="flex items-center gap-3 rounded-lg border border-border p-4">
              <span class="grid h-8 w-8 place-items-center rounded-md bg-slate-soft text-slate">
                <Sun class="h-4 w-4" />
              </span>
              <div>
                <p class="font-medium">Service matin</p>
                <p class="text-sm text-ink-muted">09:00 → 14:00</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-lg border border-border p-4">
              <span class="grid h-8 w-8 place-items-center rounded-md bg-olive-soft text-olive">
                <Moon class="h-4 w-4" />
              </span>
              <div>
                <p class="font-medium">Service soir</p>
                <p class="text-sm text-ink-muted">18:00 → 23:00</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-lg border border-border p-4">
              <span class="grid h-8 w-8 place-items-center rounded-md bg-slate-soft text-slate">
                <GraduationCap class="h-4 w-4" />
              </span>
              <div>
                <p class="font-medium">Jour de cours</p>
                <p class="text-sm text-ink-muted">7h comptées</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref="featuresSection" class="bg-cream px-4 py-12 sm:px-6 sm:py-16">
        <div class="mx-auto max-w-5xl">
          <div class="mb-8 max-w-xl sm:mb-10">
            <p class="text-sm font-semibold text-clay-dark">Fonctions</p>
            <h3 class="mt-1 text-2xl font-semibold tracking-tight">L’essentiel, rien d’autre.</h3>
          </div>

          <div class="divide-y divide-border overflow-hidden rounded-xl border border-border bg-paper">
            <div v-for="(f, i) in features" :key="i" class="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-6 sm:p-6">
              <span class="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cream text-clay">
                <component :is="f.icon" class="h-5 w-5" />
              </span>
              <div>
                <h4 class="font-semibold">{{ f.title }}</h4>
                <p class="mt-1 text-ink-light">{{ f.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="border-t border-border bg-paper px-4 py-12 sm:px-6 sm:py-16">
        <div class="mx-auto max-w-5xl">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="text-2xl font-semibold tracking-tight">Prêt à suivre vos heures proprement ?</h3>
              <p class="mt-1 text-ink-light">Une interface calme, pensée pour les semaines de restauration.</p>
            </div>
            <button @click="$emit('go-to-auth')" class="inline-flex items-center justify-center gap-2 rounded-md bg-clay px-6 py-3.5 font-semibold text-white transition hover:bg-clay-dark">
              Créer mon compte
              <ArrowRight class="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t border-border bg-cream px-4 py-6 sm:px-6">
      <div class="mx-auto flex max-w-5xl flex-col gap-2 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 TimeCook</p>
        <div class="flex items-center gap-4">
          <router-link to="/legal" class="transition hover:text-ink">Mentions légales</router-link>
          <span class="hidden sm:inline">·</span>
          <span>Suivi d’heures pour alternants.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Download,
  GraduationCap,
  Moon,
  Sun,
  Zap,
} from '@lucide/vue';

defineEmits(['go-to-auth']);

const featuresSection = ref(null);

const weekPreview = [
  { label: 'Lun', blocks: [{ type: 'work', text: 'Matin' }, { type: 'work', text: 'Soir' }], total: '11h' },
  { label: 'Mar', blocks: [{ type: 'work', text: 'Soir' }], total: '6h' },
  { label: 'Mer', blocks: [{ type: 'work', text: 'Cours' }], total: '7h' },
  { label: 'Jeu', blocks: [{ type: 'work', text: 'Matin' }, { type: 'work', text: 'Soir' }], total: '10h' },
  { label: 'Ven', blocks: [], total: 'Repos' },
  { label: 'Sam', blocks: [{ type: 'work', text: 'Soir' }], total: '6h' },
  { label: 'Dim', blocks: [], total: '—' },
];

const features = [
  { icon: Zap, title: 'Saisie en deux gestes', desc: 'Choisissez le jour, le type de journée et les horaires. Les pauses se règlent seules.' },
  { icon: Clock3, title: 'Services matin et soir', desc: 'Notez un ou deux services par jour. Les totaux se calculent automatiquement.' },
  { icon: GraduationCap, title: 'Jours de cours', desc: 'Ajoutez un jour de cours en un clic pour équilibrer votre objectif semaine/mois.' },
  { icon: CalendarDays, title: 'Objectifs semaine & mois', desc: 'Voyez d’un coup si vous êtes en avance, en retard ou juste dans les temps.' },
  { icon: Download, title: 'Export CSV', desc: 'Récupérez vos données au format tableur quand vous devez justifier vos heures.' },
];

function scrollToFeatures() {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' });
}
</script>
