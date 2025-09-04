<script setup lang="ts">

const apiUrl = import.meta.env.VITE_API

console.log("API URL:", apiUrl)

</script>



<template>
    <div class="">
        <h1>Home Page</h1>
        <p>{{ apiUrl }}</p>
    </div>
</template>

<style>
</style>
