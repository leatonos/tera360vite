<script setup lang="ts">

import { ref } from "vue";
import { useTourStore } from "../../piniaStore/store";
import type { SphereInfo } from "../../types";


//Props
const props = defineProps<{
    thisSphere:SphereInfo
}>()


//Store
const store = useTourStore()

const sceneIndex = props.thisSphere.sceneIndex
const thisSphereId = props.thisSphere.id

const sphereSize = ref(props.thisSphere.scale)
const sphereColor = ref(props.thisSphere.color)

const sphereX = ref(props.thisSphere.coordinates[0])
const sphereY = ref(props.thisSphere.coordinates[1])
const sphereZ = ref(props.thisSphere.coordinates[2])

const listOfSpheres = store.tour.scenes[sceneIndex].spheres
const thisSphereIndex = listOfSpheres.findIndex((sphere)=> sphere.id == thisSphereId)


//Actions

const handleColorChange = (value:string) =>{
    
    sphereColor.value = value
    
    const newSphereInfo:SphereInfo ={
        id: thisSphereId,
        sceneIndex: sceneIndex,
        coordinates: [sphereX.value,sphereY.value,sphereZ.value],
        scale: sphereSize.value,
        color: value
    } 
    store.editSphere(sceneIndex,thisSphereIndex,newSphereInfo)
}

const handleSizeChange = (value:string) =>{

    const newNumber = parseFloat(value)
    
    sphereSize.value = newNumber

    const newSphereInfo:SphereInfo ={
        id: thisSphereId,
        sceneIndex: sceneIndex,
        coordinates: [sphereX.value,sphereY.value,sphereZ.value],
        scale: newNumber,
        color: sphereColor.value
    } 
    store.editSphere(sceneIndex,thisSphereIndex,newSphereInfo)

}

const handleXChange = (value:string) =>{
    const newNumber = parseFloat(value)

    sphereX.value = newNumber
    
    const newSphereInfo:SphereInfo ={
        id: thisSphereId,
        sceneIndex: sceneIndex,
        coordinates: [newNumber,sphereY.value,sphereZ.value],
        scale: sphereSize.value,
        color: sphereColor.value
    } 
    store.editSphere(sceneIndex,thisSphereIndex,newSphereInfo)
}
const handleYChange = (value:string) =>{
    
    const newNumber = parseFloat(value)

    sphereY.value = newNumber

    const newSphereInfo:SphereInfo ={
        id: thisSphereId,
        sceneIndex: sceneIndex,
        coordinates: [sphereX.value,newNumber,sphereZ.value],
        scale: sphereSize.value,
        color: sphereColor.value
    } 
    store.editSphere(sceneIndex,thisSphereIndex,newSphereInfo)
}
const handleZChange = (value:string) =>{

    const newNumber = parseFloat(value)
    
    sphereZ.value = newNumber

    const newSphereInfo:SphereInfo ={
        id: thisSphereId,
        sceneIndex: sceneIndex,
        coordinates: [sphereX.value,sphereY.value,newNumber],
        scale: sphereSize.value,
        color: sphereColor.value
    } 
    store.editSphere(sceneIndex,thisSphereIndex,newSphereInfo)
}

</script>



<template>
    <div>
        <h3>Sphere Editor</h3>
        <p>{{ props.thisSphere.id }}</p>
        <p>{{ props.thisSphere.coordinates }}</p>
    </div>
    <div>
        <div>
            <label for="favcolor">Color:</label>
            <input type="color" id="favcolor" name="favcolor" v-model="sphereColor" @change="(e: Event) => handleColorChange((e.target as HTMLInputElement).value)">
        </div>
        <div>
            <label for="size">Size:</label>
            <input type="range" id="size" name="size" min="0" max="10" step=".1" v-model="sphereSize"  @change="(e: Event) => handleSizeChange((e.target as HTMLInputElement).value)">
        </div>
        <div>
            <div>
                <label for="favcolor">X:</label>
                <input type="range" id="x" name="x" min="-50" max="50" step=".1" :value="sphereX" @change="(e: Event) => handleXChange((e.target as HTMLInputElement).value)">
            </div>
            <div>
                <label for="favcolor">Y:</label>
                <input type="range" id="y" name="y" min="-50" max="50" step=".1" :value="sphereY" @change="(e: Event) => handleYChange((e.target as HTMLInputElement).value)">
            </div>
            <div>
                <label for="favcolor">Z:</label>
                <input type="range" id="z" name="z" min="-50" max="50" step=".1" :value="sphereZ" @change="(e: Event) => handleZChange((e.target as HTMLInputElement).value)">
            </div>
        </div>
    </div>
</template>

<style>

</style>
