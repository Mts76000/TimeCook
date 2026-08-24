<template>
  <div class="min-h-screen bg-cream text-ink">
    <header class="border-b border-border bg-paper">
      <div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
        <router-link to="/" class="inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-ink-light transition hover:text-ink">
          <ArrowLeft class="h-4 w-4" />
          Retour
        </router-link>
        <img src="/logo.jpeg" alt="TimeCook" class="h-8 w-8 object-cover" />
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 class="text-3xl font-semibold tracking-tight">Mentions légales & confidentialité</h1>

      <section class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Éditeur du service</h2>
        <p class="text-ink-light">
          TimeCook est une application de suivi d’heures destinée aux alternants en restauration. Le service est proposé en ligne et accessible depuis un navigateur web.
        </p>
      </section>

      <section class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Données collectées</h2>
        <p class="text-ink-light">
          Lors de l’inscription, nous collectons une adresse email et un mot de passe. Un nom peut être renseigné de manière optionnelle. Les heures de service et les jours de cours que vous saisissez sont stockés afin de calculer vos totaux et objectifs.
        </p>
        <p class="text-ink-light">
          Ces données ne sont utilisées que pour le fonctionnement de l’application. Elles ne sont ni vendues, ni transmises à des tiers, ni exploitées à des fins publicitaires.
        </p>
      </section>

      <section class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Vos droits (RGPD)</h2>
        <p class="text-ink-light">
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
        </p>
        <ul class="list-disc space-y-1 pl-5 text-ink-light">
          <li>Droit d’accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l’effacement (« droit à l’oubli »)</li>
          <li>Droit à la portabilité</li>
          <li>Droit d’opposition au traitement</li>
        </ul>
        <p class="text-ink-light">
          Pour exercer ces droits, contactez-nous par email à <a href="mailto:contact@mathis-lamotte.fr" class="text-clay hover:underline">contact@mathis-lamotte.fr</a>.
        </p>
      </section>

      <section class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Hébergement et sécurité</h2>
        <p class="text-ink-light">
          Les données sont stockées dans une base de données sécurisée. Les mots de passe sont hachés et ne sont jamais conservés en clair. Les échanges entre votre navigateur et le serveur sont chiffrés.
        </p>
      </section>

      <section class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Cookies</h2>
        <p class="text-ink-light">
          TimeCook utilise un cookie d’authentification pour vous permettre de rester connecté. Il ne sert qu’à ce usage et n’est pas utilisé à des fins de suivi ou de publicité.
        </p>
      </section>

      <section class="mt-8 space-y-4">
        <h2 class="text-xl font-semibold">Responsabilité</h2>
        <p class="text-ink-light">
          TimeCook est fourni à titre indicatif pour vous aider à suivre vos heures. Vérifiez toujours vos données avec votre employeur et votre centre de formation avant toute transmission officielle.
        </p>
      </section>
    </main>

    <footer class="border-t border-border bg-paper px-4 py-6 sm:px-6">
      <div class="mx-auto max-w-5xl text-center text-sm text-ink-muted">
        <p>© 2026 TimeCook — Suivi d’heures pour alternants</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ArrowLeft } from '@lucide/vue';
</script>
