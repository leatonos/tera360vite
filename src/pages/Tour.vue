<script setup lang="ts">
import Scene from '../components/3d-components/Scene.vue';
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from 'vue';
import type { Tour } from '../types';
import { storeToRefs } from "pinia";
import { useTourStore } from '../piniaStore/store';
//Component Imports
import LoadingAnimation from '../components/tour-components/loading.vue';
import SketchfabViewer from '../components/3d-components/SketchfabViewer.vue';
import TourNavigator from '../components/tour-components/tour-navigator.vue';
//Image Imports
import teraLogoWhite from '../assets/teraLogoBranco.svg';
import FullscreenIcon from '../assets/fullscreen.svg';
import ReverseFullscreenIcon from '../assets/fullscreen_reverse.svg';
import PanIcon from '../assets/3d.svg'; 
import TourThreeSix from '../assets/360-view.svg'

//API URL
//const apiUrl = import.meta.env.VITE_API;
const apiUrl = "https://server.tera.arq.br";

const route = useRoute();
const router = useRouter();
const store = useTourStore();
const loading = ref(true);
const loadingText = ref("");
const cornerIcon = ref(FullscreenIcon);
const leftCornerIcon = ref(PanIcon);
//const showRetry = ref(false);

const arrowText = ref("<");
const isOpen = ref(true);
const tourId = route.params.tourId as string | undefined;
const isFullscreen = ref(false);
const sceneKey = ref(0)


const box = ref<HTMLElement | null>(null);

const { tourState, tour } = storeToRefs(store);

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

   // Force Scene remount
  sceneKey.value++
}

function toogleTourView(){
  if(tourState.value == "360Tour"){
    store.setTourState("3DView")
    leftCornerIcon.value = TourThreeSix
  }else{
    store.setTourState("360Tour")
    leftCornerIcon.value = PanIcon
  }
}

onMounted(() => {
  document.addEventListener("fullscreenchange", () => {
    isFullscreen.value = !!document.fullscreenElement
    cornerIcon.value = isFullscreen.value
      ? ReverseFullscreenIcon
      : FullscreenIcon

    sceneKey.value++
  })
})

onMounted(async () => {
  if (!tourId) {
    router.replace({ path: `/` });
    return;
  }
  while (true) {
    loadingText.value = `Loading tour data...`;
    const result = await getTour(tourId);
    if (result.success) {
      console.log("Tour data fetched:");
      console.log(result);
      store.setTour(result.data);
      loading.value = false;
      break;
    }
    for (let i = 5; i > 0; i--) {
      loadingText.value = `${result.error} Retrying in ${i}...`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
});

function toggleNavigator() {
  isOpen.value = !isOpen.value;
  arrowText.value = isOpen.value ? "<" : ">";
}


/**
 * Loads tour data from the API using the provided tour ID.
 * @param id 
 */
async function getTour(id: string): Promise<{ success: true; data: Tour } | { success: false; error: string }> {
  console.log("Fetching tour with ID:", id);
  try {
    console.log(`Making API request to: Railway`);
    const response = await fetch(`${apiUrl}/tour/${id}`);
    const responseData = await response.json();
    if (response.ok) {
      console.log("Tour data received from API:", responseData);
      return { success: true, data: responseData as Tour };
    }
    const error = responseData.message || 'Unknown error';
    console.error("Failed to fetch tour data:", error);
    return { success: false, error };
  } catch (err) {
    console.error("Network error:", err);
    return { success: false, error: 'Network error. Check your connection.' };
  }
}

</script>

<template>
  <div ref="box" class="main-container">
    <!-- Loading Screen -->
    <template v-if="loading">
      <LoadingAnimation :message="loadingText" />
    </template>
     <!-- This Part only appears when data is available -->
    <template v-else>
      <!-- Sidebar -->
      <div class="tour-navigator-container" :class="{ open: isOpen }" ref="navigator">
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
            <Scene v-if="tourState === '360Tour'" :key="sceneKey" />
            <SketchfabViewer v-else-if="tourState === '3DView'" :link="tour.iframeLink" />
        </Suspense>
        <a href="https://tera.arq.br" target="_blank" rel="noopener">
          <img id="icone-superior" :src="teraLogoWhite" />
        </a>
        <!-- FullScreen Button -->
        <button class="circularBtn icone-inferior-direito" :class="{ open: isOpen }" @click="toggleFullscreen">
          <img style="width: 100%;" :src="cornerIcon" />
        </button>
        <!-- 3D View/360 Tour toogle Button -->
         <button  v-if="tour.iframeLink" class="circularBtn icone-inferior-esquerdo" :class="{ open: isOpen }" @click="toogleTourView">
          <img style="width: 100%;" :src="leftCornerIcon" />
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
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
}

/* Sidebar */
.tour-navigator-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 360px;
  height: 100%;
  background-color: #242424;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 10;
}

.tour-navigator-container.open {
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
  left: 350px;
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
  width: 100%;
  height: 100vh;
  position: relative;
}

.icone-inferior-direito {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.icone-inferior-esquerdo {
  position: fixed;
  bottom: 20px;
  z-index: 10;
  left: 20px;
  transition: left 0.3s ease;
}

.icone-inferior-esquerdo.open{
  left: 320px;
}

.circularBtn{
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
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
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

  .tour-navigator-container {
    position: absolute;
    top: auto;
    bottom: 0;
    width: 100%;
    height: 220px;
    transform: translateY(100%);
    border-right: none;
    transition: transform 0.3s ease;
  }

  .tour-navigator-container.open {
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

  .icone-inferior-direito {
    bottom: 20px;
    right: 20px;
    transition: bottom 0.3s ease;
  }

  .icone-inferior-direito.open {
    bottom: 240px;
    right: 20px;
  }

  .icone-inferior-esquerdo {
    bottom: 20px;
    left: 20px;
    transition: bottom 0.3s ease;
  }

  .icone-inferior-esquerdo.open{
    left: 20px;
    bottom: 240px;
  }

  #icone-superior {
    top: 20px;
    left: 20px;
    width: 40px;
  }
}

/* Mobile responsive settings */
@media (max-width: 480px) {



}
</style>
