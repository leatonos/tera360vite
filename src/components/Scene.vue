<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { CameraControls } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { useTourStore } from "../piniaStore/store";
import { ref, watch } from 'vue';
import * as THREE from "three";
import type { PerspectiveCamera } from "three";

//Store
const store = useTourStore()
const thisSceneIndex = ref(0);

// https://cdn.aframe.io/360-image-gallery-boilerplate/img/cubes.jpg
// https://pedrobaptista.com/photos360/testA.jpg

//Current assets
const textureResult = await useTexture({ map: store.$state.tour.scenes[thisSceneIndex.value].background });
const circles = ref(store.$state.tour.scenes[thisSceneIndex.value].circles)
let currentTexture = ref(textureResult.map);

const cameraRef = ref(null);

async function performAction(actionType: string, actionArgs: string){

  if (actionType == "Teleport") {
    console.log("Teleporting to: ", actionArgs);
    const sceneIndex = store.$state.tour.scenes.findIndex(scene => scene.id === actionArgs);
    if (sceneIndex !== -1) {
      thisSceneIndex.value = sceneIndex;
      console.log("Teleported to: ", store.$state.tour.scenes[thisSceneIndex.value].background);
      const newTexture = await useTexture({ map: store.$state.tour.scenes[thisSceneIndex.value].background });
      currentTexture.value = newTexture.map;

    }
  }

}

// Watch for changes in thisSceneIndex and update circles accordingly
watch(thisSceneIndex, (newIndex) => {
  circles.value = store.$state.tour.scenes[newIndex].circles;
});

function updateCamera() {
  if (cameraRef.value) {
    const camera: PerspectiveCamera = cameraRef.value;
    const cameraPosition = camera.position;
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    store.setCameraPosition({ x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z })
    store.setCameraDirection({ x: cameraDirection.x, y: cameraDirection.y, z: cameraDirection.z })
    
  }
}

</script>

<template>
  <TresCanvas preset="flat" :tone-mapping-exposure="0.35">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 0, .1]" :far="200" />
    <CameraControls @end="updateCamera"/>
    <!-- Sphere with the current texture -->
    <TresMesh :position="[0, 0, 0]" :scale="1">
      <TresSphereGeometry :args="[1, 180, 40]" />
      <TresMeshBasicMaterial
        :map="currentTexture"
        :side="1"
      />
    </TresMesh>
    <!-- Flat Circles -->
    <TresMesh v-for="circle in circles" :position="circle.coordinates" :scale="circle.scale" :key="circle.id" :rotation="[Math.PI / 2, 0, 0]" @click="performAction('Teleport', circle.onClickAction.actionArgs)">
      <TresCircleGeometry :args="[1, 32]" />
      <TresMeshBasicMaterial :color="circle.color"  :side="2" />
    </TresMesh>
  </TresCanvas>
</template>

<style>

</style>
