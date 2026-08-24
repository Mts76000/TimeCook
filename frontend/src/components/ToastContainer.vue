<template>
  <div class="pointer-events-none fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex max-w-md items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg"
        :class="toastClass(toast.type)"
      >
        <span class="shrink-0">
          <CheckCircle2 v-if="toast.type === 'success'" class="h-4 w-4" />
          <TriangleAlert v-else-if="toast.type === 'error'" class="h-4 w-4" />
          <Info v-else class="h-4 w-4" />
        </span>
        <span class="flex-1">{{ toast.message }}</span>
        <button @click="remove(toast)" class="shrink-0 rounded p-1 transition hover:bg-ink/10">
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../composables/useToast';
import { CheckCircle2, Info, TriangleAlert, X } from '@lucide/vue';

const { toasts, remove } = useToast();

function toastClass(type) {
  if (type === 'success') return 'border-olive bg-olive-soft text-olive';
  if (type === 'error') return 'border-terracotta bg-terracotta-soft text-terracotta';
  if (type === 'warning') return 'border-clay bg-clay-light text-clay-dark';
  return 'border-border bg-paper text-ink';
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
