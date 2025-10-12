<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { CameraControls, TransformControls } from "@tresjs/cientos";
import { useTexture } from "@tresjs/core";
import { ref, computed, watch, onMounted, type Ref } from "vue";
import * as THREE from "three";
import type { PerspectiveCamera, Mesh } from "three";
import { useTourStore } from "../../piniaStore/store";
import type { CircleInfo } from "../../types";

const store = useTourStore();

// Initial state
const currentSceneBackground = ref<string>("");
const rotationRad = ref((store.$state.tour.scenes[0].rotation || 0) * Math.PI / 180)
const cameraRef = ref<PerspectiveCamera | null>(null);
const allCircles = ref<Array<CircleInfo>>([]);
const currentSceneIndex = ref<number>(0);
const currentTexture = ref(null as THREE.Texture|null);
const loadingTexture = ref(true);
const isFading = ref(false)
const cameraSpeed = ref(-0.2)

//canvas element ref
const canvasElement = ref<HTMLElement|null>(null)

//Loads initial texture and Circles
onMounted(async() => {
  currentSceneIndex.value = store.$state.currentSceneIndex;
  currentSceneBackground.value = store.$state.tour.scenes[currentSceneIndex.value].background;
  const initialTextureResult = await useTexture({ map: currentSceneBackground.value });
  currentTexture.value = initialTextureResult.map;
  currentTexture.value.mapping = THREE.EquirectangularReflectionMapping;
  currentTexture.value.colorSpace = THREE.SRGBColorSpace;
  loadingTexture.value = false;
  // populate initial circles after texture loads
  allCircles.value = store.$state.tour.scenes[currentSceneIndex.value].circles

   if(cameraRef.value){
    const cam = cameraRef.value;
    cam.zoom = 4
    cam.updateMatrix()
  }

});


async function smoothZoom(cameraRef: Ref<THREE.PerspectiveCamera | null>,targetFov: number, speed:number): Promise<void> {
  return new Promise((resolve) => {
    if (!cameraRef.value) return resolve();
    const cam = cameraRef.value;
    let animationId: number;

    // Animation loop
    const animate = () => {
      cam.fov += (targetFov - cam.fov) * speed;
      cam.updateProjectionMatrix();

      // Continue the animation until the target FOV is reached
      if (Math.abs(cam.fov - targetFov) > 0.1) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Ensure the final FOV is set precisely
        cam.fov = targetFov;
        cam.updateProjectionMatrix();
        cancelAnimationFrame(animationId);
        resolve(); // no value needed
      }
    };

    animate();
  });
}
async function handleCircleClick (circle: CircleInfo) {
  
  //Hide circles while loading new texture
  loadingTexture.value = true
  allCircles.value = []
  
  isFading.value = true
  //Camera zoom in animation
  await smoothZoom(cameraRef, 20, 0.15)

  //Fade out
  if(!canvasElement.value){
    return;
  }else{
    canvasElement.value.classList.add("fadeOut")
  }
  
  //Getting new Scene index and data
  if(selectedCircleId.value === circle.id) return;
  const newIndex = store.$state.tour.scenes.findIndex(scene => scene.id === circle.onClickAction.actionArgs)
  currentSceneIndex.value = newIndex

  const newScene = store.$state.tour.scenes[newIndex]
  currentSceneBackground.value = newScene.background
  rotationRad.value = (newScene.rotation || 0) * Math.PI / 180

  //Loads new texture
  await useTexture({ map: currentSceneBackground.value }).then((result) => {
    if(cameraRef.value) { 
      cameraRef.value.fov = 50 
      cameraRef.value.updateProjectionMatrix()
    }
    currentTexture.value = result.map;
    currentTexture.value.mapping = THREE.EquirectangularReflectionMapping;
    currentTexture.value.colorSpace = THREE.SRGBColorSpace;
    loadingTexture.value = false;
    isFading.value = false
  });
  
  //Updates circles
  allCircles.value = store.$state.tour.scenes[newIndex].circles
  store.setCurrentSceneIndex(newIndex)


  //Fade in

}

// ---------------------------
// Selection / TransformControls
// ---------------------------
const selectedCircleId = computed(() => store.$state.selectedCircle ? store.$state.selectedCircle.id : null);
const selectedMesh = ref<Mesh | null>(null);

// store all meshes by circle ID
const meshRefs: Record<string, Mesh | null> = {};

// watch circle selection
watch(selectedCircleId, (newId) => {
  if (newId && meshRefs[newId]) {
    selectedMesh.value = meshRefs[newId];
    cameraSpeed.value = 0.2
  }else {
    selectedMesh.value = null;
    cameraSpeed.value = -0.2
  }
});
 

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
   <div class="canvas-wrapper" ref="canvasElement"  :class="{ fadeOut: isFading }">
  <TresCanvas preset="realistic" class="scene_canvas">
    <TresPerspectiveCamera ref="cameraRef" :position="[0,0,0.5]" :far="2000" :fov="50" />
    <CameraControls 
      @end="updateCamera" 
      :maxDistance="3"
      :azimuthRotateSpeed="cameraSpeed"
      :polarRotateSpeed="cameraSpeed"
      />

    <!-- Skybox -->
    <TresMesh :position="[0,0,0]" :scale="6" :rotation="[0,rotationRad,0]">
      <TresSphereGeometry :args="[1,100,100]" />
      <TresMeshBasicMaterial :map="currentTexture" :side="2" :toneMapped="false"/>
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
   </div>
</template>

<style scoped>
  /* scene canvas fadeout animation */
.canvas-wrapper {
  top: 0;
  position: relative;
  width: 100%;
  height: 100%;
  transition: opacity .6s ease;
  opacity: 1;
}

.canvas-wrapper.fadeOut {
  opacity: 0;
}
</style>