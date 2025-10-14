<script setup lang="ts">
import Scene from '../components/3d-components/Scene.vue';
import { useRoute, useRouter } from "vue-router";
const apiUrl = import.meta.env.VITE_API;
import { onMounted, ref } from 'vue';
import type { Tour } from '../types';
import { useTourStore } from '../piniaStore/store';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';

import teraLogoWhite from '../assets/teraLogoBranco.svg';
import TourNavigator from '../components/tour-components/tour-navigator.vue';

const route = useRoute();
const router = useRouter();
const store = useTourStore();
const loading = ref(true);
const loadingText = ref("");
const navigator = ref<HTMLElement | null>(null);

const arrowText = ref("<");
const isOpen = ref(true);

const tourId = route.params.tourId as string | undefined;

async function getTour(id: string) {
  console.log("Fetching tour with ID: ", id);
  const response = await fetch(`${apiUrl}/tour/${id}`);
  return await response.json();
}

function toggleNavigator() {
  isOpen.value = !isOpen.value;
  arrowText.value = isOpen.value ? "<" : ">";
}

onMounted(async () => {
  if (!tourId) {
    router.replace({ path: `/` });
  } else {
    const tourData: Tour = await getTour(tourId);
    loadingText.value = `Loading tour: ${tourId}...`;
    console.log("Tour data fetched:");
    console.table(tourData.scenes);
    store.setTour(tourData);
    loading.value = false;
  }
});
</script>

<template>
  <div class="main-container">
    <template v-if="loading">
      <div class="loading-screen">
        <DotLottieVue
          style="height: 200px; width: 500px"
          autoplay
          src="https://lottie.host/9b888865-03ce-4cce-b1ec-3c0058202c3a/VzYcqq3nGU.lottie"
        />
        <div class="loader"></div>
      </div>
    </template>
    <template v-else>
      <!-- Sidebar -->
      <div class="tuor-navigator-container" :class="{ open: isOpen }" ref="navigator">
        <TourNavigator />
      </div>
      <!-- Arrow toggle -->
      <div class="arrow-toogler" :class="{ open: isOpen }">
        <button class="arrow_btn" @click="toggleNavigator()">
          {{ arrowText }}
        </button>
      </div>
      <!-- Canvas -->
      <div class="canvas">
        <Suspense>
          <Scene />
        </Suspense>
        <a href="https://tera.arq.br" target="_blank" rel="noopener">
          <img id="logoTeraCantinho" :src="teraLogoWhite" />
        </a>
      </div>
    </template>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  position: relative;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}

/* Sidebar */
.tuor-navigator-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 300px;
  height: 100%;
  background-color: #242424;
  overflow-y: auto;
  border-right: 3px solid rgb(53, 53, 53);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 10;
}

.tuor-navigator-container.open {
  transform: translateX(0);
}

/* Arrow button */
.arrow-toogler {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  transition: left 0.3s ease;
  z-index: 20;
}

.arrow-toogler.open {
  left: 300px;
}

.arrow_btn {
  background-color: #242424;
  border: none;
  border-radius: 0 10px 10px 0;
  color: white;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

/* Canvas */
.canvas {
  flex-grow: 1;
  height: 100vh;
  position: relative;
}

#logoTeraCantinho {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 80px;
  height: auto;
  z-index: 10;
}

.loading-screen {
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
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

/* Tablet responsive settings */
@media (max-width: 768px) {
  .main-container {
    flex-direction: column-reverse;
  }

  .tuor-navigator-container {
    position: absolute;
    top: auto;
    bottom: 0;
    width: 100%;
    height: 120px;
    transform: translateY(100%);
    border-right: none;
    border-top: 3px solid rgb(53, 53, 53);
    transition: transform 0.3s ease;
  }

  .tuor-navigator-container.open {
    transform: translateY(0);
  }

  .arrow-toogler {
    top: auto;
    transform: translateY(10px);
    left: calc(50% - 10px);
  }

  .arrow-toogler.open {
    transform: translateY(100%);
    bottom: 150px;
    left: calc(50% - 10px);
  }

  .arrow_btn {
    border-radius: 0px 10px 10px 0px;
    transform: rotate(-90deg);
  }

  .canvas {
    width: 100%;
    height: calc(100vh - 120px);
  }
}

/* Mobile responsive settings */
@media (max-width: 480px) {

 .tuor-navigator-container{
  
 }
}
</style>
