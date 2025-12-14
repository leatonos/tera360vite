<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Tour } from '../types'
import HeaderVue from '../components/page-components/Header.vue'
import TourBlock from '../components/page-components/TourBlock.vue'

const apiUrl = import.meta.env.VITE_API
console.log("API URL:", apiUrl)

const isLoading = ref(true)
const allTours = ref<Tour[]>([])


//Dashboard states
const authenticated = ref(false)
const selectedImage = ref<number>(0)
const selectedTour = ref<Tour | null>(null)
const userName = localStorage.getItem("username")

onMounted( async()=>{
    
    const allToursAPIRequest = await fetch(`${apiUrl}/all-tours`);
    const allToursAPIResponse = await allToursAPIRequest.json();
    console.log("All tours fetched from API:", allToursAPIResponse);
    allTours.value = allToursAPIResponse.tours
    isLoading.value = false
   
    authenticated.value = await validateSession()
})

const validateSession = async () => {

    if(!userName){
        console.log("No username found in localStorage.");
        return false;
    }

  try {
    const res = await fetch(`${apiUrl}/check-auth`, {
        body: JSON.stringify({ username: userName }),
        headers: {
          "Content-Type": "application/json",
        },
      method: "POST",
      credentials: "include"
    });

    const data = await res.json();

    console.log("Session is valid:", data.authenticated);
    return data.authenticated === true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const changeImage = (index: number) => {
    selectedImage.value = index;
}

const deleteTour = async(tourId:string) =>{
    try {
        const response = await fetch(`${apiUrl}/delete-tour/${tourId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ user_name: userName }),
            credentials: "include"
        });

        if (response.ok) {
            console.log("Tour deleted successfully");
            // Remove the deleted tour from the allTours array
            allTours.value = allTours.value.filter(tour => tour._id !== tourId);
            selectedTour.value = null;
        } else {
            console.error("Failed to delete tour");
        }
    } catch (error) {
        console.error("Error during tour deletion:", error);
    }
}

</script>

<template>
    <template v-if="authenticated">
        <HeaderVue title="Admin DashBoard" :isAdmin=true />
        <main class="admin-dashboard">
            <div class='tours-container'>
                <div v-if="isLoading">
                    <p>Loading tours...</p>
                </div>
                <div v-else>
                   <div class="tour-list">
                        <TourBlock v-for="tour in allTours" @click="selectedTour=tour" :key="tour._id" :thisTour="tour" :language="{ 'See tour': 'See tour' }" />
                    </div>
                </div>
            </div>
            <div class="tour-preview">
                <div v-if="selectedTour">
                    <div class="tour-hero-image-container">
                        <img :src="selectedTour.scenes[selectedImage].thumbnail || 'https://placehold.co/300x200?text=No+image'" alt="Tour Main Image" class="tour-main-image" />
                    </div>
                    <div class="scenes-gallery">
                        <div v-for="scene, index in selectedTour.scenes" :key="scene.id" class="scene-item">
                            <img @click="changeImage(index)" :src="scene.thumbnail || 'https://placehold.co/150x100?text=No+Thumbnail'" alt="Scene Thumbnail" class="scene-thumbnail" />
                            <h3 ckass="white-text">{{ scene.name }}</h3>
                        </div>
                    </div>
                    <div class="tour-options">
                        <a :href="`/tour/${selectedTour._id}`" class="btn-link">Preview Tour</a>
                        <a :href="`/tour-creator/${selectedTour._id}`" class="btn-link">Edit Tour</a>
                        <button @click="deleteTour(selectedTour._id)" class="btn-link">Delete Tour</button>
                    </div>
                </div>
            </div>
        </main>
    </template>
</template>

<style scoped>

h1{
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: calc(100vh - 100px);
}

.field{
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

label{
    color: #242424;
}

#password,#username{
    background-color: #ffffff;
    border: 1px solid #242424;
    color: #242424;
    border-radius: 1px;
    padding: .4rem;
    font-size: 1em;
}
.animation{
    width: 150px;
    height: 150px;
}
p,h1,h2,h3,a,li {
    color: black;
    text-align: center;
}

.login-form{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

.submit_btn{
    background-color: #242424;
    display: block;
    text-align: center;
    width: 100%;
    color: white;
    font-weight: bold;
    border: 2px solid black;
    padding: .5rem;
    border-radius: 3px;
}


/* Admin Dashboard */

.admin-dashboard{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.tours-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    width: 50%;
    height:100%;
    overflow-y: auto;
    padding: 2.5rem;
}

.tour-preview{
    display: flex;
    flex-direction: column;
    width: 60%;
    overflow-y: auto;
    padding: 1rem;
    height: calc(100vh - 100px);
}

.tour-thumbnail, .scene-thumbnail{
    width: 150px;
    height: 80px;
    border-radius: 5px;
}

.scene-thumbnail{
    cursor: pointer;
    border: 2px solid transparent;
}

.tour-list{
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
}

.tour-hero-image-container{
    width: 100%;
}

.tour-main-image{
    width: 100%;
    border-radius: 5px;
}

.scenes-gallery{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1rem;
    width: 100%;
    overflow-x: auto;
}

.scene-item{
    width: 150px;    
}

.tour-options{
    display: flex;
    justify-content: end;
    gap: 4px;
}

.btn-link{
    display: block;
    background-color: #242424;
    color: white;
    padding: .6rem;
    margin:10px 0;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    font-weight: 600;
    border-radius: 7px;
    border: none;
}

.creator-link{
    margin-bottom: 2rem;
    width: auto;
}

.red{
    background-color: #e74c3c;
    color: white;
}



.red:hover{
    color: black;
}



</style>