<script setup lang="ts">
import { useCanvasStore } from "../../piniaStore/canvasStore";
import { useTourStore } from "../../piniaStore/store";
import type { SceneInfo } from "../../types";
import imageCompression from "browser-image-compression";

import { computed, ref } from 'vue';

//Props
const props = defineProps<{
    thisScene:SceneInfo
}>()

//Store
const store = useTourStore()
const canvasStore = useCanvasStore()


//States
const listOfScenes = computed(() => store.$state.tour.scenes)
const thisSceneId = computed(() => props.thisScene.id)
const thisSceneIndex = computed(() => listOfScenes.value.findIndex(scene => scene.id === thisSceneId.value));
const thumbnail = computed(()=>store.$state.tour.scenes[thisSceneIndex.value].thumbnail)
const sceneIndex = ref(store.tour.scenes.findIndex(scene => scene.id === props.thisScene.id));
const uploading = ref(false)
const rotation = computed(() => store.$state.tour.scenes[sceneIndex.value]?.rotation || 0);
const uploadText = ref("Upload Background")
const thumbnailBtnText = ref("Create a thumbnail")

const deleteImage = async(awsKey:string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API}/delete-image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ user_name: localStorage.getItem('username'), key: awsKey })
    });

    console.log("Delete image response:", response);

    if (response.ok) {
        console.log("Old background deleted successfully");
    } else {
      console.log(response)
        console.error("Failed to delete old background");
    }
} catch (error) {
    console.error("Error deleting old background:", error);
}
}

const compressedImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 6000,
    useWebWorker: true
  };
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // Return original file if compression fails
  }
};

const handleFileChange = async (event: Event) => {
  uploading.value = true
  
  const target = event.target as HTMLInputElement;
  
  const currentBackground = props.thisScene.background;
  const standardBackground = "https://cdn.aframe.io/360-image-gallery-boilerplate/img/cubes.jpg";

  console.log(currentBackground != standardBackground);

  if (currentBackground != standardBackground){
    //Delete old background from S3
      uploadText.value = "Deleting old background..."
      const prefix = "https://tera-tuors.s3.amazonaws.com/";
      const AWS_key = currentBackground.slice(prefix.length)

      uploadText.value='Deleting old background...'
      await deleteImage(AWS_key)

  }

  uploadText.value = "Uploading Image..."

  if (target.files && target.files[0]) {
    const file = target.files[0];
    const compressedFile = await compressedImage(file);
    const randomString = Math.random().toString(36).substring(2, 8)
    const imageUrl = await uploadToS3(compressedFile, store.$state.tour._id, `${props.thisScene.id}-${randomString}`);
    console.log("Uploaded image URL:", imageUrl);
    if (imageUrl) {
      uploadText.value = "Upload Background"
      uploading.value = false
      store.setSceneBackground(sceneIndex.value, imageUrl);
      console.log("Scene background updated in store.");
      console.log("Current scene data:", store.$state.tour.scenes[sceneIndex.value]);
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

    if (!uploadRes.ok){
      throw new Error("Upload to S3 failed");
    } 
      
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
*/

function handleRotation(value:string){
    const newNumber = parseFloat(value)
    store.setSceneRotation(sceneIndex.value, newNumber)
}

function addCircleAction(selectedSceneIndex:number){
    store.addCircle(selectedSceneIndex)
}

function deleteSceneAction(){
    const confirmDelete = confirm("Are you sure you want to delete this scene?");
    if (confirmDelete) {
        store.deleteScene(thisSceneIndex.value)
    }
}


async function createThumbnail(){

 const canvas = canvasStore.canvasRef
 if (!canvas) return console.warn('No canvas found')

 thumbnailBtnText.value='Taking a screenshot...'

 canvas.toBlob( async (blob)=>{
    if(!blob) return

     const file = new File([blob], `${props.thisScene.id}-thumbnail.png`, {
       type: "image/jpeg",
    })

    //Delete old thumbnail if exists
    if(props.thisScene.thumbnail){

      const thumbnailUrl = props.thisScene.thumbnail
      const prefix = "https://tera-tuors.s3.amazonaws.com/";
      const AWS_key = thumbnailUrl.slice(prefix.length)

      thumbnailBtnText.value='Deleting old thumbnail...'
      await deleteImage(AWS_key)
    }


    thumbnailBtnText.value='Uploading image...'

    const randomString = Math.random().toString(36).substring(2, 8)

    //Upload new thumbnail
    const imageUrl = await uploadToS3(file,store.$state.tour._id,props.thisScene.id+`-${randomString}-thumbnail`)

    thumbnailBtnText.value = "Create a thumbnail"

    if(imageUrl){
      store.setSceneThumbnail(thisSceneIndex.value,imageUrl)
    }

 }, 'image/jpeg', 0.7);

}

</script>



<template>
  <div class="editor">
   
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

    <!-- Scene Rotation -->
    <div class="form-group">
      <label class="white-text">Scene Rotation: {{ rotation }}</label>
      <input type="range" id="rotation" name="rotation" min="-180" max="180" step="1" :value="rotation"
      @change="(e: Event) => handleRotation((e.target as HTMLInputElement).value)"
      >
    </div>

     <!-- Background Upload -->
    <div  class="form-group upload-group">
      <input multiple="false" type="file" id="texture-selector" @change="handleFileChange" />
      <label for="texture-selector" class="cute-upload-btn">{{ uploadText }}</label>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button class="btn" @click="addCircleAction(thisSceneIndex)">Add new circle</button>
      <button class="btn" @click="createThumbnail">{{ thumbnailBtnText }}</button>
      <button class="red btn" @click="deleteSceneAction">Delete Scene</button>
    </div>
    <div class="thumbnail-container">
      <h3 class="white-text">Thumbnail</h3>
      <img class="thumbnail" v-if="thumbnail" :src="thumbnail"/>
    </div>
  
  </div>
</template>

<style scoped>

.red{
    background-color: #e74c3c;
    color: white;
}

.thumbnail-container{
  margin-top:15px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  
}

.thumbnail{
  width: 40%;
  height: auto;
}
</style>
