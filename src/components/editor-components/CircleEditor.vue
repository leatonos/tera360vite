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
    <div>
        <h3>Circle Editor</h3>
    </div>
    <div>
        <div>
            <button @click="deleteCircle">Delete Circle</button>
        </div>
        <!-- Color -->
        <div>
            <label for="favcolor">Color:</label>
            <input type="color" id="favcolor" name="favcolor" v-model="circleColor" @change="(e: Event) => handleColorChange((e.target as HTMLInputElement).value)">
        </div>
        <!-- Size -->
        <div>
            <label for="size">Size:</label>
            <input type="range" id="size" name="size" min="0" max="10" step=".1" v-model="circleSize"  @change="(e: Event) => handleSizeChange((e.target as HTMLInputElement).value)">
        </div>
        <!-- Coordinates -->
        <div>
            <div>
                <label for="x">X:</label>
                <input type="range" id="x" name="x" min="-50" max="50" step=".1" v-model="circleX" @change="(e: Event) => handleXChange((e.target as HTMLInputElement).value)">
            </div>
            <div>
                <label for="y">Y:</label>
                <input type="range" id="y" name="y" min="-50" max="50" step=".1" v-model="circleY" @change="(e: Event) => handleYChange((e.target as HTMLInputElement).value)">
            </div>
            <div>
                <label for="z">Z:</label>
                <input type="range" id="z" name="z" min="-50" max="50" step=".1" v-model="circleZ" @change="(e: Event) => handleZChange((e.target as HTMLInputElement).value)">
            </div>
        </div>
        <!-- Action -->
         <div>
            <label for="action">Action Type:</label>
            <select id="action" name="action">
                <option value="Teleport">Teleport</option>
            </select>
            <label for="location">Location</label>
            <select id="location" name="location" @change="handleSceneChange">
                <option value="">None   </option>
                <option v-for="scene in store.tour.scenes" :key="scene.id" :value="scene.id">{{ scene.name }}</option>
            </select>
         </div>
    </div>
</template>

<style>

</style>
