<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import Scene from '../components/3d-components/Scene.vue';
import TuorEditor from '../components/editor-components/TourEditor.vue';
import type { Tour } from '../types';
import { useTourStore } from "../piniaStore/store";

const loading = ref(true)

const store = useTourStore()
const route = useRoute();
const tourId = route.params.tourId as string | undefined
const router = useRouter();

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
  const response = await fetch("https://ro6e24o5bkdiilj4vt2jylqgvm0puruz.lambda-url.us-east-2.on.aws/create-tour", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTour)
  });
  return await response.json();
}

async function getTour(id:string) {

  console.log("Fetching tour with ID: ", id);
  const response = await fetch(`https://ro6e24o5bkdiilj4vt2jylqgvm0puruz.lambda-url.us-east-2.on.aws/tour/id=${id}`);
  return await response.json(); 
  
}


onMounted(async ()=>{
  // if no tourId, create new tour on database
  if(!tourId){
    
    const newTourResponse = await createNewTour();
    console.log("New tour created with ID: ", newTourResponse.id);
    console.log(newTourResponse.id);
    router.push({path:`/tour/${newTourResponse.id}`})
    
  } else {
    const tourData:Tour = await getTour(tourId);
    console.log("Tour data fetched:");
    console.table(tourData);
    store.setTour(tourData);
    loading.value = false;
  }
})


</script>

<template>
  <div class="main-container">
     <template v-if="loading">
        <p>Planning... boring loading</p>
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
  width: 20%;
  height: 100vh;
}
.canvas{
  background-color: aquamarine;
  width: 80%;
  height: 100vh;
}
</style>
