<script setup lang="ts">

import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { onMounted, ref } from 'vue'
import type { Tour } from '../types'
import { useRouter } from 'vue-router'
const router = useRouter();

const apiUrl = import.meta.env.VITE_API
console.log("API URL:", apiUrl)

const isLoading = ref(true)
const allTours = ref<Tour[]>([])

//Login form states
const formUser = ref("")
const formPass = ref("")

//Dashboard states
const authenticated = ref(false)
const userName = localStorage.getItem("username")

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

    const raw = JSON.stringify({"user_name": formUser.value,"password": formPass.value});

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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
            router.push("/admin-dashboard");
        } else {
            console.error("Login failed");
            // Handle login failure (e.g., show error message)
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
};

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



</script>

<template>
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
            </form>
        </div>
    </div>
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
    height: calc(100vh - 100px);
    
}

.tours-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    width: 40%;
    height:100%;
    overflow-y: auto;
    padding: 2.5rem;
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

.tour-item{
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 5px;
    text-align: center;
}

.create-new-tour{
    text-decoration: none;
    color: black;
}

.tour-intro{
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
}

.tour-info{
    display: flex;
    flex-direction: column;
    width: 30%;
    box-sizing: border-box;
    align-items: center;
}

.tour-hero-image-container{
    width: 70%;
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

.btn-link{
    background-color: #242424;
    color: white;
    width: 100%;
    display: block;
    padding: .6rem;
    margin:10px 0;
    text-decoration: none;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    font-weight: 600;
    border-radius: 5px;
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