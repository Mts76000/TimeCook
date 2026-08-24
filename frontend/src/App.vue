<template>
  <router-view />
  <ToastContainer />
</template>

<script setup>
import ToastContainer from './components/ToastContainer.vue';
</script>

<style>
/* Global fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
