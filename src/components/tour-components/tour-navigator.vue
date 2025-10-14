<script setup lang="ts">
import { ref } from "vue";
import { useTourStore } from "../../piniaStore/store";
import type { SceneInfo } from "../../types";

// Store
const store = useTourStore();
const scenes = store.$state.tour.scenes;

// State
const selectedScene = ref<SceneInfo | null>(null);

const selectScene = (scene: SceneInfo, index: number) => {
  selectedScene.value = scene;
  store.setCurrentSceneIndex(index);
};
</script>

<template>
  <div class="tour-navigator">
    <header class="tour-navigator-header"></header>
    <div class="scenes-list">
      <ul>
        <li
          v-for="(scene, sceneIndex) in scenes"
          :key="scene.id"
          class="list_item scene_item"
          @click="selectScene(scene, sceneIndex)"
        >
          {{ scene.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: white;
  font-size: 2em;
}

.tour-navigator {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  text-align: center;
  justify-items: center;
  background-color: #242424;
}

.tour-navigator-header {
  display: none;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  text-align: left;
  color: white;
  cursor: pointer;
}

.list_item {
  padding: 2px;
  border-radius: 2px;
}

.scene_item:hover {
  background-color: #3a3a3a;
}

.scenes-list {
  padding: 1rem;
  height: 30%;
  overflow-y: auto;
}

/* Tablet responsive settings */
@media (max-width: 768px) {
  .scenes-list ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .scenes-list li {
    display: inline-block;
    background-color: #2d2d2d;
    padding: 4px 8px;
    border-radius: 4px;
  }
}

/* Mobile responsive settings */
@media (max-width: 480px) {
  .scenes-list ul {
    justify-content: center;
  }
}
</style>
