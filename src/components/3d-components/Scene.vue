<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { CameraControls } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { useTourStore } from "../../piniaStore/store";
import { computed, ref, watch } from 'vue';
import * as THREE from "three";
import type { PerspectiveCamera } from "three";
//import { TransformControls } from '@tresjs/cientos';

//Store
const store = useTourStore()
const currentSceneIndex = computed(() => store.$state.currentSceneIndex);
//const boxRef = shallowRef()


//Current assets
const textureResult = await useTexture({ map: store.$state.tour.scenes[currentSceneIndex.value].background });
const circles = computed(() => store.$state.tour.scenes[currentSceneIndex.value].circles);
let currentTexture = ref(textureResult.map);
currentTexture.value.mapping = THREE.EquirectangularReflectionMapping;
currentTexture.value.colorSpace = THREE.SRGBColorSpace;


const cameraRef = ref(null);
const loadingTexture = ref(false);

// Function to handle actions
async function performAction(actionType: string, actionArgs: string){

  if (actionType == "Teleport") {
    console.log("Teleporting to: ", actionArgs);
    const sceneIndex = store.$state.tour.scenes.findIndex(scene => scene.id === actionArgs);
    console.log("Found scene index: ", sceneIndex);
    if (sceneIndex !== -1) {
      store.setCurrentSceneIndex(sceneIndex);
    }else{
      // If scene not found, do nothing or handle error
      console.warn("Scene with ID", actionArgs, "not found.");
    }
  }

}


// Watcher: whenever currentSceneIndex changes, update texture
watch(currentSceneIndex, async (newIndex) => {
  if (newIndex !== -1) {
    loadingTexture.value = true;
    const newTextureResult = await useTexture({ map: store.$state.tour.scenes[newIndex].background });
    const newTexture = newTextureResult.map
    newTexture.mapping = THREE.EquirectangularReflectionMapping;
    newTexture.colorSpace = THREE.SRGBColorSpace;
    currentTexture.value = newTexture
    loadingTexture.value = false;
  }
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
    <!-- Invert camera controls by setting reverseOrbit and reversePan -->
    <CameraControls @end="updateCamera" :reverseOrbit="true" :reversePan="true" />
    <!-- Skybox Sphere with the current texture, rendered inside --> 
    <TresMesh :position="[0, 0, 0]" :scale="6">
      <TresSphereGeometry :args="[1, 100, 100]" />
      <TresMeshBasicMaterial
        :map="currentTexture"
        :side=2
        :toneMapped="false"
      />
    </TresMesh>
    <!-- 3D Cube -->
     <!--
     <TransformControls :object="boxRef" />
    <TresMesh ref="boxRef" :position="[2, 0, 0]" :scale="1">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="#4FC3F7" />
    </TresMesh>
     -->
    <!-- Flat Circles -->
    <TresMesh v-for="circle in circles" :position="circle.coordinates" :scale="circle.scale" :key="circle.id" :rotation="[Math.PI / 2, 0, 0]" @click="performAction('Teleport', circle.onClickAction.actionArgs)">
      <TresCircleGeometry :args="[1, 32]" />
      <TresMeshBasicMaterial :color="circle.color"  :side="2" />
    </TresMesh>
  </TresCanvas>
</template>

<style>

</style>
