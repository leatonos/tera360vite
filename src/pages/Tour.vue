<script setup lang="ts">
import Scene from '../components/3d-components/Scene.vue';
import { useRoute, useRouter } from "vue-router"
const apiUrl = import.meta.env.VITE_API
import { onMounted, ref } from 'vue';

const route = useRoute()
const router = useRouter()

const loading = ref(true)

const tourId = route.params.tourId as string | undefined

async function getTour(id:string) {

  console.log("Fetching tour with ID: ", id);
  const response = await fetch(`${apiUrl}/tour/${id}`);
  return await response.json(); 
  
}


onMounted(()=>{
  if(!tourId){
    router.replace({path:`/`})
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
    <div class="canvas">
      <template v-if="loading">
        <p>Planning... boring loading</p>
      </template>
      <template v-else>
        <Suspense>
          <Scene/>
        </Suspense>
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
</style>
