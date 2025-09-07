<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import Scene from '../components/3d-components/Scene.vue';
import TuorEditor from '../components/editor-components/TourEditor.vue';
import type { Tour } from '../types';
import { useTourStore } from "../piniaStore/store";

const loading = ref(true)
const loadingText = ref("")

const store = useTourStore()
const route = useRoute();
const router = useRouter();
const tourId = route.params.tourId as string | undefined
const apiUrl = import.meta.env.VITE_API


const newTour = {
  name: "New tour",
  scenes: [
    {
      id: uuidv4(), // unique per scene
      name: "New scene",
      background: 'https://pedrobaptista.com/photos360/welder_01.jpg',
      circles: [],
      spheres: []
    }
  ]
};

async function createNewTour() {
  const response = await fetch(`${apiUrl}/create-tour`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTour)
  });
  return await response.json();
}

async function getTour(id:string) {
  console.log("Fetching tour with ID: ", id);
  const response = await fetch(`${apiUrl}/tour/${id}`);
  return await response.json(); 
}


onMounted(async ()=>{
  // if no tourId, create new tour on database
  if(!tourId){
    loadingText.value = "Creating new tour..."
    const newTourResponse = await createNewTour();
    loadingText.value = `New tour created with ID: ${newTourResponse.id}`
    console.log("New tour created with ID: ", newTourResponse.id);
    console.log(newTourResponse.id);
    router.push({ path: `/tour-creator/${newTourResponse.id}` }).then(() => {
      window.location.reload();
    });
  } else {
     loadingText.value = "Loading tour..."
    const tourData:Tour = await getTour(tourId);
    loadingText.value = `Loading tour: ${tourId}`
    console.log("Tour data fetched:");
    console.table(tourData.scenes);
    store.setTour(tourData);
    loading.value = false;
  }
})


</script>

<template>
  <div class="main-container">
     <template v-if="loading">
        <p>{{ loadingText }}</p>
      </template>
       <template v-else>
         <div class="tuor-editor">
           <TuorEditor/>
         </div>
         <div class="canvas">
             <Suspense>
               <Scene/>
             </Suspense>
         </div>
       </template>
  </div>
</template>

<style scoped>
.main-container{
  display: flex;
  background-color: yellow;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}
.tuor-editor{
  background-color: white;
  width: 25%;
  height: 100vh;
}
.canvas{
  background-color: aquamarine;
  width: 75%;
  height: 100vh;
}
</style>
