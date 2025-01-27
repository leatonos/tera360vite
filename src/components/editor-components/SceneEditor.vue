<script setup lang="ts">

import { useTourStore } from "../../piniaStore/store";
import type { Scene } from "../../types";
import CircleEditor from "./CircleEditor.vue";
import SphereEditor from "./SphereEditor.vue";
import { ref } from 'vue';

//Props
const props = defineProps<{
    thisScene:Scene
}>()

//Store
const store = useTourStore()

const listOfScenes = store.$state.tour.scenes
const thisSceneId = props.thisScene.id
const thisSceneIndex = listOfScenes.findIndex((scene)=> scene.id == thisSceneId)

const circles = props.thisScene.circles
const spheres = props.thisScene.spheres

const sceneIndex = ref(store.tour.scenes.findIndex(scene => scene.id === props.thisScene.id));

const handleBackgroundChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.setSceneBackground(sceneIndex.value, target.value);
};

const handleNameChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.setSceneName(sceneIndex.value, target.value);
};

//Actions
function addSphereAction(){
  store.addSphere(thisSceneIndex)
}

function addCircleAction(){
    store.addCircle(thisSceneIndex)
}


</script>



<template>
    <div class="scene-editor">
        <h2>Scene Editor</h2>
        <div>
            <label for="name">Scene Name</label>
            <input type="text" id="name" v-model="props.thisScene.name" @input="handleNameChange" placeholder="Enter background link" />
        </div>
        <div>
            <label for="background">Background</label>
            <input type="text" id="background" v-model="props.thisScene.background" @input="handleBackgroundChange" placeholder="Enter background link" />
        </div>
        <div>
            <button @click="addSphereAction">Add new sphere</button>
            <button @click="addCircleAction">Add new circle</button>
        </div>
        <div class="circles-list">
            <div v-for="circle in circles" :key="circle.id">
                <CircleEditor :thisCircle="circle"  />
            </div>
        </div>
        <div class="spheres-list">
            <div v-for="sphere in spheres" :key="sphere.id">
                <SphereEditor :thisSphere="sphere"  />
            </div>
        </div>
    </div>
</template>

<style>
    .scene-editor{
        padding: 1rem;
        margin: 1rem;
    }
</style>
