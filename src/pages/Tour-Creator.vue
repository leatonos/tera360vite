<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';
import Scene from '../components/3d-components/Scene.vue';
import TuorEditor from '../components/editor-components/TourEditor.vue';


const loading = ref(true)

const route = useRoute();
const tourId = route.params.tourId as string | undefined

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




onMounted(async ()=>{
  // if no tourId, create new tour on database
  if(!tourId){
    
    const newTourResponse = await createNewTour();
    console.log("New tour created with ID: ", newTourResponse.tourId);
    
  } else {
    // simulate loading for demo purposes, remove in real use
    setTimeout(() => {
      loading.value = false
    }, 2000)
  }
})


</script>

<template>
  <div class="main-container">
    <div class="tuor-editor">
      <TuorEditor/>
    </div>
    <div class="canvas">
        <Suspense>
          <Scene/>
        </Suspense>
    </div>
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
