<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { CameraControls, TransformControls } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { ref, computed, watch, nextTick } from "vue";
import * as THREE from "three";
import type { PerspectiveCamera, Mesh } from "three";
import { useTourStore } from "../../piniaStore/store";
import type { CircleInfo } from "../../types";

const store = useTourStore();

// ---------------------------
// Scene / texture
// ---------------------------
const currentSceneIndex = computed(() => store.$state.currentSceneIndex);
const currentSceneBackground = computed(
  () => store.$state.tour.scenes[currentSceneIndex.value]?.background
);

const loadingTexture = ref(true);
const visibleCircles = ref<Array<CircleInfo>>([]);
const allCircles = computed(() => store.$state.tour.scenes[currentSceneIndex.value].circles);


let initialTextureResult = await useTexture({ map: currentSceneBackground.value });
const currentTexture = ref(initialTextureResult.map);
currentTexture.value.mapping = THREE.EquirectangularReflectionMapping;
currentTexture.value.colorSpace = THREE.SRGBColorSpace;

// populate initial circles after texture loads
visibleCircles.value = store.$state.tour.scenes[currentSceneIndex.value]?.circles.map(c => ({ ...c })) || [];
loadingTexture.value = false;

const cameraRef = ref<PerspectiveCamera | null>(null);

// ---------------------------
// Selection / TransformControls
// ---------------------------
const selectedCircleId = computed(() => store.$state.selectedCircle ? store.$state.selectedCircle.id : null);
const selectedMesh = ref<Mesh | null>(null);

// store all meshes by circle ID
const meshRefs: Record<string, Mesh | null> = {};

// watch circle selection
watch(selectedCircleId, (newId) => {
  if (newId && meshRefs[newId]) selectedMesh.value = meshRefs[newId];
  else selectedMesh.value = null;
});

// 
function handleCircleClick(circle: CircleInfo) {
  //finds the index based on scene Id
  if(selectedCircleId.value === circle.id) return;
  const newIndex = store.$state.tour.scenes.findIndex(scene => scene.id === circle.onClickAction.actionArgs)
  store.setCurrentSceneIndex(newIndex)
}


function handleTransformChange() {
  if (!selectedMesh.value) return;

  const pos = selectedMesh.value.position;
  const circleId = selectedCircleId.value;

 store.editCircle(
    currentSceneIndex.value,
    store.$state.tour.scenes[currentSceneIndex.value].circles.findIndex(c => c.id === circleId),
    {
      ...store.$state.selectedCircle!,
      coordinates: [pos.x, pos.y, pos.z]
    }
  );
}

const currentSceneCircles = computed(() => store.$state.tour.scenes[currentSceneIndex.value].circles);

watch(currentSceneCircles, (newCircles) => {
  visibleCircles.value = newCircles.map(c => ({ ...c }));
});

// ---------------------------
// Scene changes / texture reload
// ---------------------------
watch(currentSceneIndex, async (newIndex) => {
  if (newIndex === -1) return;
  selectedMesh.value = null;

  loadingTexture.value = true;
  //visibleCircles. value = [];
  await nextTick();

  try { currentTexture.value?.dispose?.(); } catch(e){}

  const newTextureResult = await useTexture({ map: store.$state.tour.scenes[newIndex].background });
  const newTexture = newTextureResult.map;
  newTexture.mapping = THREE.EquirectangularReflectionMapping;
  newTexture.colorSpace = THREE.SRGBColorSpace;
  currentTexture.value = newTexture;

  await nextTick();

  //visibleCircles.value = store.$state.tour.scenes[newIndex].circles.map(c => ({ ...c }));
  loadingTexture.value = false;
});

// ---------------------------
// Camera updates
// ---------------------------
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
    <TresPerspectiveCamera ref="cameraRef" :position="[0,0,0.5]" :far="10" />
    <CameraControls @end="updateCamera" :reverseOrbit="true" :reversePan="true" />

    <!-- Skybox -->
    <TresMesh :position="[0,0,0]" :scale="6">
      <TresSphereGeometry :args="[1,100,100]" />
      <TresMeshBasicMaterial :map="currentTexture" :side="2" :toneMapped="false" />
    </TresMesh>

    <!-- Circles -->
    <TresMesh
      v-for="circle in allCircles"
      :key="circle.id"
      :position="circle.coordinates"
      :scale="circle.scale"
      :rotation="[Math.PI/2,0,0]"
      @click="handleCircleClick(circle)"
      :ref="el => { if(el) meshRefs[circle.id] = el as unknown as Mesh }"
    >
      <TresCircleGeometry :args="[1,32]" />
      <TresMeshBasicMaterial
        :color="circle.color"
        :side="2"
      />
    </TresMesh>

    <!-- TransformControls attached to selected mesh -->
    <TransformControls
      v-if="selectedMesh"
      :object="selectedMesh"
      @objectChange="handleTransformChange"
      mode="translate"
    />
  </TresCanvas>
</template>
