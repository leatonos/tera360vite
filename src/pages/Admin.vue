<script setup lang="ts">

import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { onMounted, ref } from 'vue'
import type { Tour } from '../types'

const apiUrl = import.meta.env.VITE_API
console.log("API URL:", apiUrl)

const isLoading = ref(true)
const allTours = ref<Tour[]>([])

const formUser = ref("")
const formPass = ref("")
const authenticated = ref(false)

const selectedTour = ref<Tour | null>(null)

onMounted( async()=>{
    
    const allToursAPIRequest = await fetch(`${apiUrl}/all-tours`);
    const allToursAPIResponse = await allToursAPIRequest.json();
    console.log("All tours fetched from API:", allToursAPIResponse);
    allTours.value = allToursAPIResponse.tours
    isLoading.value = false
   
    authenticated.value = await validateSession()
})

const loginAction = async (event: Event) => {
    event.preventDefault();

    const raw = JSON.stringify({
    "user_name": formUser.value,
    "password": formPass.value
    });

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: raw,
        });

        if (response.ok) {
            console.log("Login successful");
            const data = await response.json();
            console.log("Response data:", data);
            localStorage.setItem("username", formUser.value);
            authenticated.value = true;
            // Redirect to admin dashboard or perform other actions
        } else {
            console.error("Login failed");
            // Handle login failure (e.g., show error message)
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
};

const validateSession = async () => {

  const userName = localStorage.getItem("username");
  try {
    const res = await fetch(`${apiUrl}/check-auth`, {
        body: JSON.stringify({ username: userName }),
        headers: {
          "Content-Type": "application/json",
        },
      method: "POST",
      credentials: "include"    // <-- THIS sends the HttpOnly cookie
    });

    const data = await res.json();

    console.log("Session is valid:", data.authenticated);
    return data.authenticated === true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
      

</script>

<template>
    <template v-if="authenticated">
        <div class="admin-dashboard">
            <div class='tours-container'>
                <h2>All Tours</h2>
                <div v-if="isLoading">
                    <p>Loading tours...</p>
                </div>
                <div v-else>
                   <div class="tour-list">
                       <div v-for="tour in allTours" :key="tour._id" class="tour-item" @click="selectedTour = tour">
                            <img :src="tour.scenes[0].thumbnail || 'https://placehold.co/150x100?text=No+image'" alt="Tour Thumbnail" class="tour-thumbnail" />
                            <h3>{{ tour.name }}</h3>
                            <p>Scenes: {{ tour.scenes.length }}</p>
                       </div>
                    </div>
                </div>

            </div>
            <div class="tour-preview">
                <h1>Admin Dashboard</h1>
                <h2>Select a tour</h2>
                <div v-if="selectedTour">
                    <h3>{{ selectedTour.name }}</h3>
                    <p>Total Scenes: {{ selectedTour.scenes.length }}</p>
                    <div class="tour-intro">
                        <div class="tour-info">
                            <h3>{{ selectedTour.name }}</h3>
                        </div>
                        <div class="tour-gallery">
                            <img :src="selectedTour.scenes[0].thumbnail || 'https://placehold.co/300x200?text=No+image'" alt="Tour Main Image" class="tour-main-image" />
                        </div>
                    </div>
                    <div class="scenes-list">
                        <div v-for="scene in selectedTour.scenes" :key="scene.id" class="scene-item">
                            <img :src="scene.thumbnail || 'https://placehold.co/150x100?text=No+image'" alt="Scene Thumbnail" class="scene-thumbnail" />
                            <h3>{{ scene.name }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
    <div class="login-page">
        <DotLottieVue class="animation" autoplay src="https://lottie.host/9b888865-03ce-4cce-b1ec-3c0058202c3a/VzYcqq3nGU.lottie" />
        <div class="box">
            <h1>Admin login</h1>
            <form class="login-form" v-on:submit="loginAction">
                <div class="field">
                    <label for="username">Username:</label>
                    <input type="text" class="form-input" id="username" name="username" v-model="formUser" required />
                </div>
                <div class="field">
                    <label class="white-text" for="password">Password:</label>
                    <input type="password" class="form-input" id="password" name="password" v-model="formPass" required />
                </div>
                <button class="submit_btn" type="submit">Login</button>
                <button :onclick="validateSession" class="submit_btn" type="button">Check Auth</button>
            </form>
        </div>
    </div>
    </template>
</template>

<style>

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
        display: block;
        text-align: center;
        width: 100%;
        background-color: #242424;
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
    width: 100vw;
}

.tours-container{
    width: 40%;
    overflow-y: auto;
    border-right: 2px solid #ccc;
    padding: 1rem;
}

.tour-preview{
    width: 60%;
    padding: 1rem;
}

.tour-thumbnail, .scene-thumbnail{
    width: 150px;
    height: 80px;
    border-radius: 5px;
}

.tour-list{
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.tour-item{
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 5px;
    text-align: center;
}

.tour-intro{
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
}

.tour-info{
    width: 30%;
}

.tour-gallery{
    width: 70%;
    margin-top: 1rem;
}

.tour-main-image{
    width: 100%;
    border-radius: 5px;
}

.scenes-list{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 1rem;
}

.scene-item{
    width: 150px;
}


</style>