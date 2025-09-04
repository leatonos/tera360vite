<script setup lang="ts">
import { useTourStore } from "../../piniaStore/store";
import type { SceneInfo } from "../../types";
import CircleEditor from "./CircleEditor.vue";
import SphereEditor from "./SphereEditor.vue";
import { ref } from 'vue';

//Props
const props = defineProps<{
    thisScene:SceneInfo
}>()

//Store
const store = useTourStore()

const listOfScenes = store.$state.tour.scenes
const thisSceneId = props.thisScene.id
const thisSceneIndex = listOfScenes.findIndex((scene)=> scene.id == thisSceneId)

const circles = props.thisScene.circles
const spheres = props.thisScene.spheres

const sceneIndex = ref(store.tour.scenes.findIndex(scene => scene.id === props.thisScene.id));


const uploadImage = async (file: File, sceneId: string, tourId:string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('scene_id', sceneId);
  formData.append('tuor_id', tourId);

  try {
    const response = await fetch(`${import.meta.env.VITE_API}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.newURL;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.files);
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const imageUrl = await uploadImage(file,props.thisScene.id,store.$state.tour._id);
    if (imageUrl) {
      store.setSceneBackground(sceneIndex.value, imageUrl);
    }
  }
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
            <input type="file" id="background" @change="handleFileChange" />
            <p>{{ props.thisScene.background }}</p>
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
