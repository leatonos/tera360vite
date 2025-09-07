<script setup lang="ts">

import { ref } from "vue";
import { useTourStore } from "../../piniaStore/store";
import type { CircleInfo } from "../../types";


//Props
const props = defineProps<{
    thisCircle:CircleInfo
}>()


//Store
const store = useTourStore()

const sceneIndex = props.thisCircle.sceneIndex
const thisCircleId = props.thisCircle.id

const circleSize = ref(props.thisCircle.scale)
const circleColor = ref(props.thisCircle.color)

const circleX = ref(props.thisCircle.coordinates[0])
const circleY = ref(props.thisCircle.coordinates[1])
const circleZ = ref(props.thisCircle.coordinates[2])

const listOfCircles = store.tour.scenes[sceneIndex].circles
const thisCircleIndex = listOfCircles.findIndex((circle)=> circle.id == thisCircleId)

const createNewCircleInfo = (): CircleInfo => {
    return {
        id: thisCircleId,
        sceneIndex: sceneIndex,
        coordinates: [circleX.value, circleY.value, circleZ.value] as [number, number, number],
        scale: circleSize.value,
        color: circleColor.value,
        onClickAction: {
            actionType: "Teleport",
            actionArgs: ""
        }
    };
};

//Actions

const handleColorChange = (value:string) =>{
    
    circleColor.value = value
    store.editCircle(sceneIndex,thisCircleIndex,createNewCircleInfo())
}

const handleSizeChange = (value:string) =>{

    const newNumber = parseFloat(value)
    
    circleSize.value = newNumber
    store.editCircle(sceneIndex,thisCircleIndex,createNewCircleInfo())

}

const handleXChange = (value:string) =>{
    const newNumber = parseFloat(value)

    circleX.value = newNumber
    store.editCircle(sceneIndex,thisCircleIndex,createNewCircleInfo())
}
const handleYChange = (value:string) =>{
    
    const newNumber = parseFloat(value)

    circleY.value = newNumber
    store.editCircle(sceneIndex,thisCircleIndex,createNewCircleInfo())
}
const handleZChange = (value:string) =>{

    const newNumber = parseFloat(value)
    
    circleZ.value = newNumber
    store.editCircle(sceneIndex,thisCircleIndex,createNewCircleInfo())
}

const handleSceneChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    console.log("Scene change: ", target.value);
    store.setCircleActionArgs(sceneIndex, thisCircleIndex, target.value);
};

const deleteCircle = () => {
    store.deleteCircle(sceneIndex, thisCircleIndex);
}

</script>


<template>
  <div class="circle-editor">
    <h3 class="title">Circle Editor</h3>
    <!-- Color -->
    <div class="form-group-inline">
      <label for="favcolor">Color:</label>
      <input
        type="color"
        id="favcolor"
        v-model="circleColor"
        @change="(e: Event) => handleColorChange((e.target as HTMLInputElement).value)"
      />
      <!-- Size -->
      <label for="size">Size:</label>
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
        <label for="x">X:</label>
        <input
          type="number"
          id="x"
          min="-5"
          max="5"
          step=".1"
          v-model="circleX"
          @change="(e: Event) => handleXChange((e.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group-inline">
        <label for="y">Y:</label>
        <input
          type="number"
          id="y"
          min="-4.3"
          max="5"
          step=".1"
          v-model="circleY"
          @change="(e: Event) => handleYChange((e.target as HTMLInputElement).value)"
        />
      </div>
      <div class="form-group-inline">
        <label for="z">Z:</label>
        <input
          type="number"
          id="z"
          min="-5"
          max="5"
          step=".1"
          v-model="circleZ"
          @change="(e: Event) => handleZChange((e.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Action -->
    <div class="form-group-inline">
      <label for="action">Action Type:</label>
      <select id="action" v-model="props.thisCircle.onClickAction.actionType">
        <option value="Teleport">Teleport</option>
      </select>
    </div>

    <div class="form-group-inline">
      <label for="location">Location:</label>
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
.circle-editor {
  background: #242424;
  font-family: sans-serif;
  color: white;
}

.title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #fff;
}

.delete-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 1rem;
  width: 100%;
  font-weight: bold;
}
.delete-btn:hover {
  background: #e04345;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group-inline {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-inline {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.form-inline div {
  display: flex;
  flex-direction: column;
  flex: 1;
}

label {
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #fff;
}

input[type="number"] {
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #555;
  background: #333;
  color: white;
  font-size: 15px;
  width: 100%;
}

input[type="color"] {
  width: 60px;
  height: 40px;
  border: none;
  cursor: pointer;
  background: transparent;
}

select {
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 6px;
  background: #333;
  color: white;
  font-size: 15px;
  cursor: pointer;
}
select option {
  background: #242424;
  color: white;
}
</style>
