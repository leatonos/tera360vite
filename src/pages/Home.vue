<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { onMounted, ref } from 'vue'
import type { Tour } from '../types'
import TourBlock from '../components/page-components/TourBlock.vue'


const apiUrl = import.meta.env.VITE_API

console.log("API URL:", apiUrl)

const isLoading = ref(true)
const allTours = ref<Tour[]>([])


onMounted( async()=>{
    const allToursAPIRequest = await fetch(`${apiUrl}/all-tours`);
    const allToursAPIResponse = await allToursAPIRequest.json();
    console.log("All tours fetched from API:", allToursAPIResponse);
    allTours.value = allToursAPIResponse.tours
    isLoading.value = false
})

</script>



<template>
    <div class="home-page">
        <DotLottieVue autoplay src="https://lottie.host/9b888865-03ce-4cce-b1ec-3c0058202c3a/VzYcqq3nGU.lottie" />
        <div class="test">
            <h1>Welcome to Tera360</h1>
            <h2>Create and explore 360° virtual tours</h2>
            <div v-if="isLoading">
                <p>Loading tours...</p>
            </div>
            <div v-else>
                <div class="tour-list">
                    <a href="/tour-creator" class="create-tour-button"><h3>Create New Tour</h3></a>
                    <TourBlock v-for="tour in allTours" :key="tour._id" :thisTour="tour" />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.home-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
}
.animation{
    width: 150px;
    height: 150px;
}
.tour-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
}
p,h1,h2,h3,a,li {
    color: black;
}
.create-tour-button{
        display: block;
        text-align: center;
        width: 100px;
        border: 2px solid black;
        padding: 1rem;
        border-radius: 3px;
    }
</style>
