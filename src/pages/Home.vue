<script setup lang="ts">
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { onMounted, ref } from 'vue'
import type { SceneInfo, Tour } from '../types'
import TourBlock from '../components/page-components/TourBlock.vue'

const apiUrl = import.meta.env.VITE_API

console.log("API URL:", apiUrl)

const isLoading = ref(true)
const allTours = ref<Tour[]>([])

const selectedTour = ref<Tour|null>(null)
const selectedScene = ref<SceneInfo|null>(null)

onMounted( async()=>{
    const allToursAPIRequest = await fetch(`${apiUrl}/all-tours`);
    const allToursAPIResponse = await allToursAPIRequest.json();
    console.log("All tours fetched from API:", allToursAPIResponse);
    allTours.value = allToursAPIResponse.tours
    isLoading.value = false
})

const previewImageUrl = () =>{
    if(selectedTour.value){
        return selectedScene.value?.thumbnail || 'https://placehold.co/300x200?text=No+thumbnail'
    }
    else{
        return 'https://placehold.co/300x200?text=No+thumbnail'
    }
}

const getBg = (scene: SceneInfo) => ({
  backgroundImage: `url(${scene.thumbnail || 'https://placehold.co/150x100?text=No+Thumbnail'})`
});

const selectTour = (tour: Tour) =>{
    selectedTour.value = tour
    selectedScene.value = tour.scenes[0]
    console.log("Selected tour:", tour)
}

const selectScene = (scene: SceneInfo) =>{
    selectedScene.value = scene
    console.log("Selected scene:", scene)
}
    

</script>



<template>
    <div class="home-page">
        <header>
            <div class="logo-container">
                <a href="https://tera.arq.br" target="_blank" rel="noopener noreferrer">
                    <DotLottieVue class="animated-logo" autoplay src="https://lottie.host/9b888865-03ce-4cce-b1ec-3c0058202c3a/VzYcqq3nGU.lottie" />
                </a>
            </div>
            <div class="header-title">
                <h1>Tera360</h1>
                <h2>Tours virtuais renderizados pela Tera arquitura</h2>
            </div>
        </header>
        <main>
            <div class="tour-selection-container">
                <h3 style="margin-bottom: 10px;">Explore 360° virtual tours</h3>
                <div v-if="isLoading">
                    <p>Loading tours...</p>
                </div>
                <div v-else>
                    <div class="tour-list">
                        <TourBlock v-for="tour in allTours" @click="selectTour(tour)" :key="tour._id" :thisTour="tour" />
                    </div>
                </div>
            </div>
            <div v-if="selectedTour" class="tour-preview-container">
                <h3>{{ selectedTour.name }}</h3>
                <div class="tour-hero-image-container">
                    <img :src="previewImageUrl()" alt="Tour Main Image" class="tour-main-image" />
                </div>
                <div class="tour-images-gallery">
                    <div @click="selectScene(scene)" v-for="scene in selectedTour.scenes" class="scene-item" :style="getBg(scene)" :key="scene.id">
                        <h4 class="white-text">{{ scene.name }}</h4>
                    </div> 
                </div>
                <div class="tour-options">
                    <a :href="`/tour/${selectedTour._id}`" class="btn-link">Ver Tour</a>
                </div>
            </div>
            <div v-else class="tour_not_selected">
                <p>Selecione um tour</p>
            </div>
        </main>
    </div>
</template>

<style scoped>

.home-page {
    display: flex;
    flex-direction: column;
    width: 100%;
}

header{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    gap: 2rem;
}

.logo-container{
    width: 120px;
    margin-left: 1rem;
}
.header-title{
   padding-left: 40px;
}

.header-subtitle{
    font-size: .8em;
    color: #242424;
}

h1{
    font-size: 1em;
    color: #242424;
    margin: 0;
}
h2{
    font-size:.8em;
    color: #242424;
}
h3,h4,p{
    color: #242424;
}
.animated-logo{
    width: 100%;
    margin-left: 1rem;
}

main{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    gap: 1rem;
}

.tour-selection-container{
    padding: 2rem;
    width: 55%;
    max-height: calc(100vh - 130px);
    overflow: auto;
    box-sizing: border-box;
}

.tour-list{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
}

.tour-preview-container{
    padding: 0rem 3rem;
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    box-sizing: border-box;
    height: calc(100hv - 60px);
}

.tour_not_selected{
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.2em;
    margin-top: 2rem;
}

.tour-hero-image-container{
    width: 100%;
}

.tour-main-image{
    width: 100%;
    border-radius: 5px;
}

.tour-images-gallery{
    display: flex;
    gap: 1rem;
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: auto;
    box-sizing: border-box;
}

.scene-item{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 150px;
    height: 80px;
    border-radius: 1px;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
    box-sizing: border-box;
}

.white-text{
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 3.2px;
}

.tour-options{
    margin-top: 20px;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
}

.btn-link{
    background-color: #242424;
    color: white;
    font-weight: bold;
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    margin-top: 10px;
}

/* Medium devices (tablets) */
@media (max-width: 992px) {
    main{
        flex-direction: column;
        align-items: center;
    }
    
    .tour-selection-container{
        width: 100%;
    }
    
    .tour-preview-container, .tour_not_selected{
        display: none;
    }

    header{
       padding-top: 10px;
    }
}


/* Small devices (phones) */
@media (max-width: 576px) {
  /* styles for smartphones */
}

</style>
