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

// Test Image been used
// https://pedrobaptista.com/photos360/welder_01.jpg

//Current assets
const textureResult = await useTexture({ map: store.$state.tour.scenes[thisSceneIndex.value].background });
const circles = ref(store.$state.tour.scenes[thisSceneIndex.value].circles)
let currentTexture = ref(textureResult.map);

// ✅ Fix brightness/contrast of the texture
if (currentTexture.value) {
  currentTexture.value.mapping = THREE.EquirectangularReflectionMapping;
  currentTexture.value.colorSpace = THREE.SRGBColorSpace;
}

const cameraRef = ref(null);

// Function to handle actions
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
  <TresCanvas preset="realistic">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 0, .5]" :far="10" />
    <CameraControls @end="updateCamera"/>
    <!-- Skybox Sphere with the current texture, rendered inside -->
    <TresMesh :position="[0, 0, 0]" :scale="1" castShadow receiveShadow>
      <TresSphereGeometry :args="[1, 100, 100]" />
      <TresMeshBasicMaterial
        :map="currentTexture"
        :side=2
        :toneMapped="false"
        
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
