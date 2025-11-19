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

onMounted( async()=>{
    const allToursAPIRequest = await fetch(`${apiUrl}/all-tours`);
    const allToursAPIResponse = await allToursAPIRequest.json();
    console.log("All tours fetched from API:", allToursAPIResponse);
    allTours.value = allToursAPIResponse.tours
    isLoading.value = false
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
  try {
    const res = await fetch(`${apiUrl}/check-auth`, {
        headers: {
          "Content-Type": "application/json",
        },
      method: "GET",
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
</style>