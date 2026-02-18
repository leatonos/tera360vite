<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

const props = defineProps<{
  loadingProgress?: number | null;
}>();


</script>

<template>
  <div class="loading-screen">
    <DotLottieVue
      style="width: 100%; max-width: 300px"
      autoplay
      src="https://lottie.host/9b888865-03ce-4cce-b1ec-3c0058202c3a/VzYcqq3nGU.lottie"
    />
    <div class="loader"></div>

    <!-- Show progress only if provided -->
    <div v-if="props.loadingProgress" class="progress-text">{{ props.loadingProgress }}%</div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: absolute;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

/* Loader animation */
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid;
  border-color: #000 #0000;
  animation: fadeIn 1s ease forwards 1.5s, l1 1s linear infinite;
  opacity: 0;
}

@keyframes l1 {
  to {
    transform: rotate(0.5turn);
  }
}
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.progress-text {
  margin-top: 16px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}
</style>
