<script setup lang="ts">
import { useTourStore } from "../../piniaStore/store";
import type { SceneInfo } from "../../types";
import { computed, ref } from 'vue';

//Props
const props = defineProps<{
    thisScene:SceneInfo
}>()

//Store
const store = useTourStore()

const listOfScenes = computed(() => store.$state.tour.scenes)
const thisSceneId = computed(() => props.thisScene.id)
const thisSceneIndex = computed(() =>
  listOfScenes.value.findIndex(scene => scene.id === thisSceneId.value)
)
const sceneIndex = ref(store.tour.scenes.findIndex(scene => scene.id === props.thisScene.id));

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  console.log(target.files);
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const imageUrl = await uploadToS3(file, store.$state.tour._id, props.thisScene.id);
    console.log("Uploaded image URL:", imageUrl);
    if (imageUrl) {
      store.setSceneBackground(sceneIndex.value, imageUrl);
    }
  }
};

const uploadToS3 = async(file: File, tourId: string, sceneId: string) => {
  try {
    // 1. Ask backend for presigned URL
    console.log("Requesting presigned URL for tour:", tourId, "scene:", sceneId);
    const res = await fetch(`${import.meta.env.VITE_API}/get-presigned-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tour_id: tourId, scene_id: sceneId })
    });

    if (!res.ok) throw new Error("Failed to get presigned URL");
    const { uploadURL, fileURL } = await res.json();

    console.log("Received presigned URL:", uploadURL);
    console.log("Uploading file to S3...");  
    // 2. Upload file directly to S3
    const uploadRes = await fetch(uploadURL, {
      method: "PUT",
      body: file
    });

    if (!uploadRes.ok) throw new Error("Upload to S3 failed");

    console.log("✅ File uploaded:", fileURL);
    return fileURL; // final public S3 link

  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
}


const handleNameChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  store.setSceneName(sceneIndex.value, target.value);
};

//Actions
/*
function addSphereAction(){
  store.addSphere(thisSceneIndex)
}
*/

function addCircleAction(){
    store.addCircle(thisSceneIndex.value)
}
</script>



<template>
  <div class="scene-editor">
    <h2 class="editor-title">Scene Editor</h2>

    <!-- Scene Name -->
    <div class="form-group">
      <input
        type="text"
        id="name"
        v-model="props.thisScene.name"
        @input="handleNameChange"
        placeholder="Enter scene name"
      />
    </div>

     <!-- Background Upload -->
    <div class="form-group upload-group">
      <input type="file" id="texture-selector" @change="handleFileChange" />
      <label for="texture-selector" class="cute-upload-btn">Upload Background</label>
    </div>

    <!-- Actions -->
    <div class="actions">
      <!-- <button @click="addSphereAction">Add new sphere</button> -->
      <button class="btn" @click="addCircleAction">Add new circle</button>
    </div>
  </div>
</template>

<style>
.scene-editor {
  max-width: 400px;
}
.editor-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  color: white;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
}

input[type="text"] {
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

input[type="text"]:focus {
  outline: none;
  border-color: #ffb6c1;
}

/* Hide the native file input */
#texture-selector {
  display: none;
}

/* Cute upload button */
.cute-upload-btn {
  display: inline-block;
  background: black;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 3px;
  padding: 0.6rem .8rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.cute-upload-btn:hover {
  background: white;
  color: black;
  transform: scale(1.05);
}

.actions {
  display: flex;
  justify-content: center;
}

.btn {
  background: white;
  color: #242424;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn:hover {
  background: #000000;
  color: #ffffff;
}
</style>
