<script setup lang="ts">

import { useTourStore } from "../../piniaStore/store";
import { v4 as uuidv4 } from 'uuid';
import SceneEditor from "./SceneEditor.vue";

const uniqueId = uuidv4();

//Store
const store = useTourStore()
const scenes = store.$state.tour.scenes

//Actions

const addSceneAction = store.addScene

</script>



<template>
    <div class="tour-editor">
        <h1>Tour Editor</h1>
        <p>{{ uniqueId }}</p>
    
    <div>
        <button @click="addSceneAction">Add new scene</button>
    </div>
     <!--
    <div class="camera-look">
        <h2>Camera Look</h2>
        <p>Camera Direction: {{ store.$state.cameraDirection }}</p>
        <p>Camera Position: {{ store.$state.cameraPosition }}</p> 
    </div>
    -->
    <div class="scenes-list">
        <div v-for="scene in scenes" :key="scene.id">
            <SceneEditor :thisScene="scene"/>
        </div>
    </div>
    </div>
</template>

<style>
    .tour-editor{
        overflow-y: auto;
        max-height: 100vh;
    }
</style>
