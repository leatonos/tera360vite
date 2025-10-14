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
   
</template>

<style scoped>
</style>
