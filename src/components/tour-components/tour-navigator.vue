<script setup lang="ts">

import { ref } from "vue";
import { useTourStore } from "../../piniaStore/store";
import type { SceneInfo } from "../../types";

//Store
const store = useTourStore()
const scenes = store.$state.tour.scenes
const storeState = store.$state

//State
const selectedScene = ref<SceneInfo|null>(null)

const selectScene = (scene:SceneInfo, index:number) =>{
    selectedScene.value = scene
    console.log("Selected scene:", index)
    console.log("Selected scene:", scene)
    store.setCurrentSceneIndex(index)
}


</script>

<template>
    <div class="tour-navigator">
      <header class="tour-navigator-header">
      </header>
        <div class="scenes-list">
            <ul v-for="(scene, sceneIndex) in scenes" :key="scene.id">
               <li class="list_item scene_item" @click="selectScene(scene, sceneIndex)">{{ scene.name }}</li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
    h1{
      color: white;
      font-size: 2em;
    }
    .tour-navigator{
        display: flex;
        flex-direction: column;
        height: 100vh;
        text-align: center;
        background-color: #242424;
    }
    .tour-navigator-header{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 30%;
      padding: 0px;
      max-height: 150px;
    }
    ul{
        list-style-type: none;
        padding: 0;
    }
    .circles-list{
      padding-left: 1rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    li{
      text-align: left;
      color: white;
      cursor: pointer;
    }
    .scenes-list{
        padding: 1rem;
        border: 3px solid rgb(53, 53, 53);
        height: 30%;
        overflow-y: auto;
    }
    .properties-panel{
        flex-grow: 1;
        padding: 1rem;
        border: 3px solid rgb(53, 53, 53);
        background-color: #242424;
        color: white;
        height: 40%;
        overflow-y: auto;
    }
    .save_btn{
      border: none;
      margin-top: 10px;
    }

    .list_item{
      padding: 2px;
      border-radius: 2px;
    }

    .scene_item:hover{
      background-color: #3a3a3a;
    }

    .circle_item:hover{
      background-color: #505050;
    }
</style>
