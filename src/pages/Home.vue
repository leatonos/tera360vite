<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SceneInfo, Tour } from '../types'
import TourBlock from '../components/page-components/TourBlock.vue'
import { getCountry, type Translation } from '../utilis/getCountry'
import { englishTranslations, portugueseTranslations } from '../utilis/getCountry'
import HeaderVue from '../components/page-components/Header.vue'

const apiUrl = import.meta.env.VITE_API

console.log("API URL:", apiUrl)

const isLoading = ref(true)
const allTours = ref<Tour[]>([])

const selectedTour = ref<Tour|null>(null)
const selectedScene = ref<SceneInfo|null>(null)

const language = ref<Translation>(englishTranslations)

onMounted( async()=>{
    const allToursAPIRequest = await fetch(`${apiUrl}/all-tours`);
    const allToursAPIResponse = await allToursAPIRequest.json();
    console.log("All tours fetched from API:", allToursAPIResponse);
    allTours.value = allToursAPIResponse.tours
    isLoading.value = false

    const userCountry = await getCountry();

    if(userCountry.country_name === "Brazil"){
        language.value = portugueseTranslations
    }
    else{
        language.value = englishTranslations
    }

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
        <HeaderVue title="Tour 360" />
        <main>
            <div class="tour-selection-container">
                <h3 style="margin-bottom: 10px;">{{ language["Explore 360° virtual tours"] }}</h3>
                <div v-if="isLoading">
                    <p>{{language.Loading}}</p>
                </div>
                <div v-else>
                    <div class="tour-list">
                        <TourBlock v-for="tour in allTours" @click="selectTour(tour)" :key="tour._id" :thisTour="tour" :language="language" />
                    </div>
                </div>
            </div>
            <div v-if="selectedTour" class="tour-preview-container">
                <div class="tour-hero-image-container">
                    <img :src="previewImageUrl()" alt="Tour Main Image" class="tour-main-image" />
                </div>
                <div class="tour-images-gallery">
                    <div @click="selectScene(scene)" v-for="scene in selectedTour.scenes" class="scene-item" :style="getBg(scene)" :key="scene.id">
                        <h4 class="white-text gray-bg">{{ scene.name }}</h4>
                    </div> 
                </div>
                <div class="tour-options">
                    <a :href="`/tour/${selectedTour._id}`" class="btn-link">{{ language['See tour'] }}</a>
                </div>
            </div>
            <div v-else class="tour_not_selected">
                <p>Selecione um tour</p>
            </div>
        </main>
        <footer>
            <p style="text-align: center; padding: 10px 0px; color: white;">{{ language.Copyright }}</p>
        </footer>
    </div>
</template>

<style scoped>

.home-page {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    overflow-y: hidden;
    width: 100%;
}

footer{
    width: 100%;
    background-color: #242424;
    color: white;
    margin-top: auto;
}

.logo-container{
    width: 120px;
    margin-left: 1rem;
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


main{
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.tour-selection-container{
    padding: 2rem;
    width: 50%;
    height: calc(100vh - 80px);
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
    display: flex;
    padding: 1rem;
    width: 50%;
    height: 100%;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    overflow-y: auto;
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
    display: flex;
    justify-content: center;
    width: 100%;
    height: calc(65% - 3rem);
    box-sizing: border-box;
}

.tour-main-image{
    width: 100%;
    height: 100%;
    object-fit:cover;
    border-radius: 5px;
}

.tour-images-gallery{
    display: flex;
    gap: 1rem;
    flex-wrap: nowrap;
    width: 100%;
    height: 20%;
    overflow-x: auto;
    box-sizing: border-box;
}

.scene-item{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 25%;
    height: 100%;
    border-radius: 1px;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;
    box-sizing: border-box;
}

.white-text{
    color: white;
    padding: 3.2px;
}

.gray-bg{
    background-color: rgba(0, 0, 0, 0.6);
}

.tour-options{
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: flex-end;
}

.btn-link{
    display: block;
    background-color: #242424;
    color: white;
    font-weight: bold;
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    max-height:fit-content;
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
