<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { CameraControls } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { useTourStore } from "../../piniaStore/store";
import { computed, ref, watch, nextTick } from 'vue';
import * as THREE from "three";
import type { PerspectiveCamera } from "three";

const store = useTourStore();
const currentSceneIndex = computed(() => store.$state.currentSceneIndex);
const currentSceneBackground = computed(() => store.$state.tour.scenes[currentSceneIndex.value].background);

// UI state
const loadingTexture = ref(true);
// Render from this array (we populate it only after texture finish loading)
const visibleCircles = ref<Array<any>>([]);

let initialTextureResult = await useTexture({ map: currentSceneBackground.value });
const currentTexture = ref(initialTextureResult.map);
currentTexture.value.mapping = THREE.EquirectangularReflectionMapping;
currentTexture.value.colorSpace = THREE.SRGBColorSpace;

// populate initial circles after initial texture
visibleCircles.value = store.$state.tour.scenes[currentSceneIndex.value].circles.map(c => ({ ...c }));
loadingTexture.value = false;

const cameraRef = ref<PerspectiveCamera | null>(null);

async function performAction(actionType: string, actionArgs: string){
  if (actionType === "Teleport") {
    const sceneIndex = store.$state.tour.scenes.findIndex(scene => scene.id === actionArgs);
    if (sceneIndex !== -1) store.setCurrentSceneIndex(sceneIndex);
    else console.warn("Scene with ID", actionArgs, "not found.");
  }
}

watch(currentSceneIndex, async (newIndex) => {
  if (newIndex === -1) return;

  // 1) start loading and immediately clear visible circles to force unmount
  loadingTexture.value = true;
  visibleCircles.value = [];

  // 2) allow DOM/three to unmount the meshes
  await nextTick();

  // 3) dispose previous texture (helpful to ensure no caching weirdness)
  try {
    currentTexture.value?.dispose?.();
  } catch (e) { /* ignore */ }

  // 4) load new texture
  const newTextureResult = await useTexture({ map: store.$state.tour.scenes[newIndex].background });
  const newTexture = newTextureResult.map;
  newTexture.mapping = THREE.EquirectangularReflectionMapping;
  newTexture.colorSpace = THREE.SRGBColorSpace;
  currentTexture.value = newTexture;

  // 5) again wait a tick (gives Tres a chance to apply the new sky)
  await nextTick();

  // 6) set the circles as a fresh array (forces new nodes)
  visibleCircles.value = store.$state.tour.scenes[newIndex].circles.map(c => ({ ...c }));

  loadingTexture.value = false;
});

function updateCamera() {
  if (!cameraRef.value) return;
  const cam = cameraRef.value;
  const pos = cam.position;
  const dir = new THREE.Vector3();
  cam.getWorldDirection(dir);
  store.setCameraPosition({ x: pos.x, y: pos.y, z: pos.z });
  store.setCameraDirection({ x: dir.x, y: dir.y, z: dir.z });
}
</script>

<template>
  <TresCanvas preset="realistic">
    <TresPerspectiveCamera ref="cameraRef" :position="[0, 0, .5]" :far="10" />
    <CameraControls @end="updateCamera" :reverseOrbit="true" :reversePan="true" />

    <!-- Skybox -->
    <TresMesh :position="[0,0,0]" :scale="6">
      <TresSphereGeometry :args="[1, 100, 100]" />
      <TresMeshBasicMaterial :map="currentTexture" :side="2" :toneMapped="false" />
    </TresMesh>

    <!-- Circles: render only from visibleCircles and key each mesh by scene+id -->
    <TresMesh
      v-for="circle in visibleCircles"
      :key="`s${currentSceneIndex}-c${circle.id}`"
      :position="circle.coordinates"
      :scale="circle.scale"
      :rotation="[Math.PI / 2, 0, 0]"
      @click="performAction('Teleport', circle.onClickAction.actionArgs)"
    >
      <TresCircleGeometry :args="[1, 32]" />
      <TresMeshBasicMaterial :color="circle.color" :side="2" />
    </TresMesh>
  </TresCanvas>
</template>
