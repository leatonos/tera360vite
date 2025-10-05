<script setup lang="ts">
import Scene from '../components/3d-components/Scene.vue';
import { useRoute, useRouter } from "vue-router"
const apiUrl = import.meta.env.VITE_API
import { onMounted, ref } from 'vue';
import type { Tour } from '../types';
import { useTourStore } from '../piniaStore/store';

import teraLogoWhite from '../assets/teraLogoBranco.svg'

const route = useRoute()
const router = useRouter()
const store = useTourStore()
const loading = ref(true)
const loadingText = ref("")

const tourId = route.params.tourId as string | undefined

async function getTour(id:string) {

  console.log("Fetching tour with ID: ", id);
  const response = await fetch(`${apiUrl}/tour/${id}`);
  return await response.json(); 
  
}


onMounted(async()=>{
  if(!tourId){
    router.replace({path:`/`})
  } else {
   const tourData:Tour = await getTour(tourId);
    loadingText.value = `Loading tour: ${tourId}...`
    console.log("Tour data fetched:");
    console.table(tourData.scenes);
    store.setTour(tourData);
    loading.value = false;
  }
})

</script>

<template>
  <div class="main-container">
    <div class="canvas">
      <template v-if="loading">
        <p>{{ loadingText }}</p>
      </template>
      <template v-else>
        <Suspense>
          <Scene/>
        </Suspense>
        <a href="https://tera.arq.br" target="_blank" rel="noopener">
          <img id="logoTeraCantinho" :src="teraLogoWhite" />
        </a>
      </template>
    </div>
  </div>
</template>


<style scoped>
.main-container{
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}
.canvas{
  width: 100%;
  height: 100vh;
}

#logoTeraCantinho{
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 100px;
  opacity: 0.7;
}
</style>
