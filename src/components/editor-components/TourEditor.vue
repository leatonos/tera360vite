<script setup lang="ts">

import { ref } from "vue";
import { useTourStore } from "../../piniaStore/store";
import SceneEditor from "./SceneEditor.vue";
import CircleEditor from "./CircleEditor.vue";
import type { CircleInfo, SceneInfo } from "../../types";

const apiUrl = import.meta.env.VITE_API

//Store
const store = useTourStore()
const scenes = store.$state.tour.scenes

const storeState = store.$state

//Actions
const addSceneAction = store.addScene


//State
const selectedScene = ref<SceneInfo|null>(null)
const selectedCircle = ref<CircleInfo|null>(null)



const selectScene = (scene:SceneInfo) =>{
    selectedCircle.value = null
    selectedScene.value = scene
}

const selectCircle = (circle:CircleInfo) =>{
  console.log("Selected circle:", circle)
    selectedScene.value = null
    selectedCircle.value = circle
}

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
      <header class="tour-editor-header">
        
        <div>
           <h1>Tour Editor</h1>
            <input type="text" id="tuor_name" name="tuor_name" v-model="storeState.tour.name"  @change="(e: Event) => handleNameChange((e.target as HTMLInputElement).value)">
            <div>
              <button @click="save">Save</button>
              <button @click="addSceneAction">Add new scene</button>
            </div>
        </div>  
      </header>
        <div class="scenes-list">
            <ul v-for="scene in scenes" :key="scene.id">
               <li @click="selectScene(scene)">{{ scene.name }}</li>
               <ul v-for="(circle, idx) in scene.circles" :key="circle.id" class="circles-list">
                 <li @click="selectCircle(circle)">
                   Circle {{ idx + 1 }}
                 </li>
               </ul>
            </ul>
        </div>
         <div class="properties-panel">
            <SceneEditor v-if="selectedScene" :thisScene="selectedScene" />
            <CircleEditor v-if="selectedCircle" :thisCircle="selectedCircle" :key="selectedCircle.id" />
        </div>
    </div>
</template>

<style>
    .tour-editor{
        display: flex;
        flex-direction: column;
        height: 100vh;
        text-align: center;
        background-color: #242424;
    }
    .tour-editor-header{
      height: 15%;
    }
    ul{
        list-style-type: none;
        padding: 0;
    }
    .circles-list{
      padding-left: 1rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    li{
      text-align: left;
      color: white;
      cursor: pointer;
    }
    .scenes-list{
        padding: 1rem;
        border: 3px solid rgb(53, 53, 53);
        height: 30%;
        overflow-y: auto;
    }
</style>
