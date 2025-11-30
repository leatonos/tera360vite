<script setup lang="ts">
import Scene from '../components/3d-components/Scene.vue';
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from 'vue';
import type { Tour } from '../types';
import { useTourStore } from '../piniaStore/store';
import LoadingAnimation from '../components/tour-components/loading.vue';

import teraLogoWhite from '../assets/teraLogoBranco.svg';
import TourNavigator from '../components/tour-components/tour-navigator.vue';
import FullscreenIcon from '../assets/fullscreen.svg';
import ReverseFullscreenIcon from '../assets/fullscreen_reverse.svg';

const apiUrl = import.meta.env.VITE_API;
const route = useRoute();
const router = useRouter();
const store = useTourStore();
const loading = ref(true);
const loadingText = ref("");
const cornerIcon = ref(FullscreenIcon);
const navigator = ref<HTMLElement | null>(null);

const arrowText = ref("<");
const isOpen = ref(true);
const tourId = route.params.tourId as string | undefined;
const isFullscreen = ref(false);

const box = ref<HTMLElement | null>(null);


function toggleFullscreen() {
  if (!document.fullscreenElement) {
    box.value?.requestFullscreen();
    isFullscreen.value = true;
    cornerIcon.value = ReverseFullscreenIcon;
  } else {
    document.exitFullscreen();
    cornerIcon.value = FullscreenIcon;
    isFullscreen.value = false;
  }
}

async function getTour(id: string) {
  console.log("Fetching tour with ID: ", id);
  const response = await fetch(`${apiUrl}/tour/${id}`);
  return await response.json();
}

function toggleNavigator() {
  isOpen.value = !isOpen.value;
  arrowText.value = isOpen.value ? "<" : ">";
}

const screenToggleIcon = ref(FullscreenIcon);

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
  <div ref="box" class="main-container">
    <template v-if="loading">
      <LoadingAnimation />
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
          <img id="icone-superior" :src="teraLogoWhite" />
        </a>
        <button class="fullscreen_btn" id="icone-inferior" @click="toggleFullscreen">
          <img style="width: 100%;" :src="cornerIcon" />
        </button>
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

#icone-inferior {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.fullscreen_btn{
  width: 40px;
  height: 40px;
  background-color: white;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 8px;
  box-sizing: border-box;
  cursor: pointer;
}

#icone-superior {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 150px;
  height: auto;
  z-index: 10;
}

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
    height: 220px;
    transform: translateY(100%);
    border-right: none;
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
    bottom: 250px;
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

  #icone-inferior {
    bottom: 240px;
    right: 20px;
  }
  #icone-superior {
    top: 20px;
    left: 20px;
    width: 60px;
  }
}

/* Mobile responsive settings */
@media (max-width: 480px) {



}
</style>
