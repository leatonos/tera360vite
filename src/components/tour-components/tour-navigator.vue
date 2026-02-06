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
          <h3 class="scene-name">{{ scene.name }}</h3>
          <img class="scene-thumbnail" v-if="scene.thumbnail" :src="scene.thumbnail"></img>
        </div>
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
  padding: 1em;
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
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 2px;
  border-radius: 2px;
  cursor: pointer;
  padding:12px;
  border-radius:4px;
}

.scene-name{
  color: white;
  text-align: center;
}

.scene-thumbnail{
  width:120px;
  border-radius:2px;
}

.list_item:hover {
  background-color: #3a3a3a;
}



.scenes-list {
  flex:1;
  padding: 1rem;
  overflow-y: auto;
}

.scenes-list::-webkit-scrollbar {
  width: 6px;
}

.scenes-list::-webkit-scrollbar-track {
  background: transparent;
}

.scenes-list::-webkit-scrollbar-thumb {
  background: #cfcfcf;
  border-radius: 20px;
}

/* Tablet responsive settings */
@media (max-width: 768px) {

  .tour-navigator{
    height:auto;
  }

  .scenes-list {
    display: flex;
    flex-direction:row;
    align-items:center;
    overflow-y:hidden;
    overflow-x:auto;
  }

  .list_item{
    display:flex;
    margin:0px 10px;
    padding:0px;
    flex-direction:column-reverse;
  }

  .scene-name{
    margin-top:6px
  }

}

/* Mobile responsive settings */
@media (max-width: 480px) {
 
}
</style>
