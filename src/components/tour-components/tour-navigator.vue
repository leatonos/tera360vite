<script setup lang="ts">
import { ref } from "vue";
import { useTourStore } from "../../piniaStore/store";
import type { SceneInfo } from "../../types";

// Store
const store = useTourStore();
const scenes = store.$state.tour.scenes;

// State
const selectedScene = ref<SceneInfo | null>(null);
const tourTitle = store.$state.tour.name

const selectScene = (scene: SceneInfo, index: number) => {
  selectedScene.value = scene;
  store.setCurrentSceneIndex(index);
};
</script>

<template>
  <div class="tour-navigator">
    <header class="tour-navigator-header">
      <h1>{{ tourTitle }}</h1>
    </header>
    <div class="scenes-list">
        <div v-for="(scene, sceneIndex) in scenes":key="scene.id" class="list_item" @click="selectScene(scene, sceneIndex)">
          <div class="text_container">
            <h3 class="scene-name">{{ scene.name }}</h3>
          </div>
          <img class="scene-thumbnail" v-if="scene.thumbnail" :src="scene.thumbnail"></img>
        </div>
    </div>
  </div>
</template>

<style scoped>

/* ------------------ */
/* Base (Mobile First) */
/* ------------------ */

.tour-navigator {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%; /* safer than 100vh on mobile */
  background-color: #242424;
}

.tour-navigator-header {
  padding: 1rem;
  padding-bottom:0px;
}

h1 {
  color: white;
  font-size: 1.6rem;
  margin: 0;
}

.scenes-list {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: row;       /* horizontal */
  gap: 1rem;
  overflow-x: auto;          /* enable sideways scroll */
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

/* Scene Card */
.list_item {
  flex: 0 0 45%;             /* card takes 85% of screen width */
  max-width: 320px;          /* prevents huge cards on large phones */

  display: flex;
  flex-direction: column;

  background: #2f2f2f;
  border-radius: 8px;
  overflow: hidden;

  scroll-snap-align: start;
  transition: transform 0.2s ease, background 0.2s ease;
}

.list_item:hover {
  background-color: #3a3a3a;
  transform: translateY(-2px);
}

.scene-thumbnail {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.text_container {
  padding: 0.75rem 1rem;
}

.scene-name {
  color: white;
  font-size: 1rem;
  margin: 0;
}

/* Scrollbar styling */
.scenes-list::-webkit-scrollbar {
  width: 6px;
}

.scenes-list::-webkit-scrollbar-thumb {
  background: #cfcfcf;
  border-radius: 20px;
}

/* ------------------ */
/* Tablet (≥ 768px) */
/* ------------------ */

@media (min-width: 768px) {

  .scenes-list {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    gap: 1rem;
  }

  .tour-navigator-header {
  padding: 1rem;
  padding-bottom:1rem;
}

  .list_item {
    min-width: 280px;
    flex-shrink: 0;
  }

  .scene-thumbnail {
    height: 160px;
  }
}

/* ------------------ */
/* Desktop (≥ 1024px) */
/* ------------------ */

@media (min-width: 1024px) {

  .scenes-list {
    flex-direction: column;
    overflow-y: auto;
  }

  .list_item {
    flex: auto;
    flex-direction: row;
    align-items: center;
  }

  .scene-thumbnail {
    width: 50%;
    height: 120px;
  }

  .text_container {
    width: 50%;
  }

  .scene-name {
    font-size: 1.1rem;
  }
}

</style>
