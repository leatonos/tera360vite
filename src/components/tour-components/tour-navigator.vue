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

/* ------------------- */
/* Base (Mobile First) */
/* ------------------- */

.tour-navigator {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  flex: 0 1 100%;       
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
  flex: 0 0 100%;             /* card takes 85% of screen width */
  max-width: 160px;          /* prevents huge cards on large phones */
 
  display: flex;
  flex-direction: column;

  background: #2f2f2f;
  border-radius: 8px;
  overflow: hidden;

  scroll-snap-align: start;
  transition: transform 0.2s ease, background 0.2s ease;
  cursor: pointer;
}

.list_item:hover {
  background-color: #3a3a3a;
  transform: translateY(-2px);
}

.scene-thumbnail {
  width: 100%;
  height: 500px;
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
    max-width: 320px;
    flex-shrink: 0;
  }

  .scene-thumbnail {
    height: 100%;
  }
}

/* ------------------ */
/* Desktop (≥ 1024px) */
/* ------------------ */

@media (min-width: 1024px) {

  .scenes-list {
     flex: 1 1 100%;
    flex-direction: column;
    gap: 0.75rem;
  }

  .list_item {
    flex: 1 1 100%;
    flex-direction: row;
    align-items: stretch;
    min-height: 120px;
    max-height: 140px;
    margin-bottom: 0;
  }

  .list_item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .scene-thumbnail {
    width: 140px;
    height: 100%;
    flex-shrink: 0;
    object-fit: cover;
  }

  .text_container {
    flex: 1;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .scene-name {
    font-size: 1.2rem;
    font-weight: 500;
  }

  h1 {
    font-size: 2rem;
  }
}

/* ------------------ */
/* Large Desktop (≥ 1440px) */
/* ------------------ */

@media (min-width: 1440px) {
  
  .tour-navigator-header {
    padding: 1.5rem;
  }

  .scenes-list {
    padding: 1rem;
  }

  .list_item {
    min-height: 140px;
    max-height: 160px;
  }

  .scene-thumbnail {
    width: 160px;
  }

  .text_container {
    padding: 1.5rem 2rem;
  }

  .scene-name {
    font-size: 1.3rem;
  }

  h1 {
    font-size: 2.2rem;
  }
}

/* ------------------ */
/* Accessibility & Motion */
/* ------------------ */

@media (prefers-reduced-motion: reduce) {
  .list_item {
    transition: none;
  }
}

/* Focus states for keyboard navigation */
.list_item:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* Loading states */
.scene-thumbnail[src=""] {
  background-color: #404040;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scene-thumbnail[src=""]:after {
  content: "Loading...";
  color: #888;
  font-size: 0.9rem;
}

/* Active scene indicator */
.list_item.active {
  background-color: #1a5490;
  border: 2px solid #007bff;
}

.list_item.active:hover {
  background-color: #1e5ba8;
}

/* Error states */
.scene-thumbnail[alt*="error"] {
  background-color: #4a2424;
  color: #ff6b6b;
}

</style>
