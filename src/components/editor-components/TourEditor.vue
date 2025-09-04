<script setup lang="ts">

import { useTourStore } from "../../piniaStore/store";
import SceneEditor from "./SceneEditor.vue";

const apiUrl = import.meta.env.VITE_API

//Store
const store = useTourStore()
const scenes = store.$state.tour.scenes

const storeState = store.$state

//Actions

const addSceneAction = store.addScene

const save = async() =>{
    
  const itemId = store.$state.tour._id
  const updateData = store.$state.tour

  console.log("Saving tour with ID:", itemId)
  console.log("Update data:")
  console.log(JSON.stringify(updateData

  ))

  try {
    const response = await fetch(`${apiUrl}/update/${itemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const updatedDoc = await response.json()
    console.log("Updated document:", updatedDoc)
  } catch (err) {
    console.error("Update failed:", err)
  }
    
}

const handleNameChange = (value:string) =>{

    store.setTourName(value)

}

</script>



<template>
    <div class="tour-editor">
        <h1>Tour Editor</h1>
        <p>{{ store.$state.tour._id }}</p>
         <!-- 
            <p>{{ JSON.stringify(store.$state) }}</p>
         -->
        <div>
            <label for="tuor_name">Tuor Name:</label>
            <input type="text" id="tuor_name" name="tuor_name" v-model="storeState.tour.name"  @change="(e: Event) => handleNameChange((e.target as HTMLInputElement).value)">
        </div>         
        <div>
            <button @click="save">Save</button>
            <button @click="addSceneAction">Add new scene</button>
        </div>
        <!--
            <div class="camera-look">
                <h2>Camera Look</h2>
                <p>Camera Direction: {{ store.$state.cameraDirection }}</p>
                <p>Camera Position: {{ store.$state.cameraPosition }}</p> 
            </div>
        -->
        <div class="scenes-list">
            <div v-for="scene in scenes" :key="scene.id">
                <SceneEditor :thisScene="scene"/>
            </div>
        </div>
    </div>
</template>

<style>
    .tour-editor{
        overflow-y: auto;
        max-height: 100vh;
        text-align: center;
    }
</style>
