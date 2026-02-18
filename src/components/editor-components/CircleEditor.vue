<script setup lang="ts">

import { useTourStore } from "../../piniaStore/store";
import type { CircleInfo } from "../../types";

//Props
const props = defineProps<{
    thisCircle:CircleInfo,
    index:number
}>()


//Store
const store = useTourStore()

const sceneIndex = props.thisCircle.sceneIndex
const thisCircleId = props.thisCircle.id

const circleSize = props.thisCircle.scale
const circleColor = props.thisCircle.color

const listOfCircles = store.tour.scenes[sceneIndex].circles
const thisCircleIndex = listOfCircles.findIndex((circle)=> circle.id == thisCircleId)

const sceneName = store.tour.scenes[sceneIndex].name

//Actions
const handleColorChange = (value: string) => {
  store.tour.scenes[sceneIndex]
    .circles[thisCircleIndex]
    .color = value
}

const handleSizeChange = (value: string) => {
  const newNumber = parseFloat(value)

  store.tour.scenes[sceneIndex]
    .circles[thisCircleIndex]
    .scale = newNumber
}

const handleXChange = (value: string) => {
  const newNumber = parseFloat(value)

  store.tour.scenes[sceneIndex]
    .circles[thisCircleIndex]
    .coordinates[0] = newNumber
}

const handleYChange = (value: string) => {
  const newNumber = parseFloat(value)

  store.tour.scenes[sceneIndex]
    .circles[thisCircleIndex]
    .coordinates[1] = newNumber
}


const handleZChange = (value: string) => {
  const newNumber = parseFloat(value)

  store.tour.scenes[sceneIndex]
    .circles[thisCircleIndex]
    .coordinates[2] = newNumber
}

const handleSceneChange = (event: Event) => {
  const target = event.target as HTMLSelectElement

  store.tour.scenes[sceneIndex]
    .circles[thisCircleIndex]
    .onClickAction.actionArgs = target.value
}


const deleteCircle = () => {
    store.deleteCircle(sceneIndex, thisCircleIndex);
}

</script>


<template>
  <div class="editor">
    <h3 class="title">{{ sceneName }} - Circle {{ props.index }}</h3>
    <!-- Color -->
    <div class="form-group-inline">
      <label class="white-text" for="favcolor">Color:</label>
      <input
        type="color"
        id="favcolor"
        v-model="circleColor"
        @change="(e: Event) => handleColorChange((e.target as HTMLInputElement).value)"
      />
      <!-- Size -->
      <label class="white-text" for="size">Size:</label>
      <input
        type="number"
        id="size"
        min=".1"
        max="5"
        step=".1"
        v-model="circleSize"
        @change="(e: Event) => handleSizeChange((e.target as HTMLInputElement).value)"
      />
    </div>
    <!-- Coordinates -->
    <div class="form-group-inline">
      <div class="form-group-inline">
        <label class="white-text" for="x">X:</label>
        <input
          type="number"
          id="x"
          min="-35"
          max="35"
          step=".1"
          v-model="props.thisCircle.coordinates[0]"
          @change="(e: Event) => handleXChange((e.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group-inline">
        <label class="white-text" for="y">Y:</label>
        <input
          type="number"
          id="y"
          min="-4.3"
          max="5"
          step=".1"
          v-model="props.thisCircle.coordinates[1]"
          @change="(e: Event) => handleYChange((e.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group-inline">
        <label class="white-text" for="z">Z:</label>
        <input
          type="number"
          id="z"
          min="-5"
          max="5"
          step=".1"
          v-model="props.thisCircle.coordinates[2]"
          @change="(e: Event) => handleZChange((e.target as HTMLInputElement).value)"
        />
      </div>
    </div>
    <!-- Action -->
    <div class="form-group-inline">
      <label class="white-text" for="action">Action Type:</label>
      <select id="action" v-model="props.thisCircle.onClickAction.actionType">
        <option value="Teleport">Teleport</option>
      </select>
    </div>
    <!-- Scene Teleport Selection -->
    <div class="form-group-inline">
      <label class="white-text" for="location">Location:</label>
      <select
        id="location"
        v-model="store.tour.scenes[sceneIndex].circles[thisCircleIndex].onClickAction.actionArgs"
        @change="handleSceneChange"
      >
        <option value="">None</option>
        <option v-for="scene in store.tour.scenes" :key="scene.id" :value="scene.id">
          {{ scene.name }}
        </option>
      </select>
    </div>
    <button class="delete-btn" @click="deleteCircle">Delete Circle</button>
  </div>
</template>
<style scoped>
 .title{
    color: white;
    font-size: 1.5em;
    margin-bottom: 1rem;
    text-align: center;
 }
  </style>
