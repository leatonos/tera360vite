<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { CameraControls, TransformControls, Ring } from "@tresjs/cientos";
import { loadAllTextures } from "../../utilis/loadAllTextures";
import LoadingAnimation from "../tour-components/loading.vue";
import { ref, computed, watch, onMounted, type Ref, nextTick } from "vue";
import * as THREE from "three";
import type { PerspectiveCamera, Mesh } from "three";
import { useTourStore } from "../../piniaStore/store";
import { useCanvasStore } from "../../piniaStore/canvasStore";
import type { CircleInfo } from "../../types";

// Pinia Stores
const store = useTourStore();
const canvasStore = useCanvasStore()


// Initial state
const currentSceneBackground = ref<string>("");
const rotationRad = ref((store.$state.tour.scenes[0].rotation || 0) * Math.PI / 180)
const cameraRef = ref<PerspectiveCamera | null>(null);
const allCircles = ref<Array<CircleInfo>>([]);
const currentSceneIndex = ref<number>(0);
const textures = ref<Record<string, THREE.Texture>>({});
const currentTexture = ref(null as THREE.Texture|null);
const loadingTexture = ref(true);
const loadingProgress = ref(0);
const isFading = ref(false)
const cameraSpeed = ref(-0.2)
const isTouch = ref(false);


// ---------------------------
// Handle changes in circles of current scene
// ---------------------------
/*
watch(
  
  () => store.$state.tour.scenes[currentSceneIndex.value]?.circles,
  (newCircles) => {
    console.log("I am changing")
    if (newCircles) {
      // force reactivity update with new reference
      allCircles.value = [...newCircles];
      console.log(allCircles.value[0])
    }
  },
  { deep: true }
);
*/

//canvas element ref
const canvasElement = ref<HTMLElement|null>(null)

async function setSceneTexture(url: string) {
  const tex = textures.value[url];
  if (tex) {
    currentTexture.value = tex;
    currentSceneBackground.value = url;
  }else{
    console.log("Texture not found for URL:", url);
    console.log("loading new texture...");
    loadingTexture.value = true;
    const loadingTextureResult = await loadAllTextures([url], (percent) => {
      loadingProgress.value = percent;
    });
    textures.value[url] = loadingTextureResult[url];
    console.log(textures);
    loadingTexture.value = false;
    currentTexture.value = loadingTextureResult[url];
    currentSceneBackground.value = url;
  }
}


//Loads initial texture and Circles
onMounted(async () => {

  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("dblclick", (e) => e.preventDefault());

  const index = store.$state.currentSceneIndex || 0;
  const scene = store.$state.tour.scenes[index];
  loadingTexture.value = true;

  //Creates a list of all backgrounds to preload them
  const allBackgrounds = store.$state.tour.scenes.map(scene => scene.background);
  
  // Preload all textures and tracks loading progress
  const loadAllTexturesResult = await loadAllTextures(allBackgrounds, (percent) => {
    loadingProgress.value = percent;
  });

  textures.value = loadAllTexturesResult;

  // Sets initial texture
  setSceneTexture(scene.background);
  currentSceneIndex.value = index;
  rotationRad.value = (scene.rotation || 0) * Math.PI / 180;
  allCircles.value = scene.circles;
  
  // Finishes loading sequence
  loadingTexture.value = false;

   isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if(window.innerWidth < 600 || 'ontouchstart' in window || navigator.maxTouchPoints > 0){
    cameraSpeed.value = -0.4
  }

  await nextTick()

  const localCanvasElement = canvasElement.value?.querySelector('canvas') as HTMLCanvasElement | null

   if (localCanvasElement) {
    canvasStore.setCanvas(localCanvasElement)
  }

});


//Animated zoom function
async function smoothZoom(
  cameraRef: Ref<THREE.PerspectiveCamera | null>,
  targetFov: number,
  duration = 400
): Promise<void> {
  return new Promise((resolve) => {
    if (!cameraRef.value) return resolve();

    const cam = cameraRef.value;
    const startFov = cam.fov;
    const startTime = performance.now();

    function animate(time: number) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);

      // easeInOut
      const eased = t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;

      cam.fov = startFov + (targetFov - startFov) * eased;
      cam.updateProjectionMatrix();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animate);
  });
}


/**
 * Circle click handler - Scene transition
 * @param circle - CircleInfo of the clicked circle
 **/
async function handleCircleClick(circle: CircleInfo) {
  if (selectedCircleId.value === circle.id) return;
  if (isFading.value) return;

  isFading.value = true;

  await smoothZoom(cameraRef, 25, 400);

  const newIndex = store.$state.tour.scenes.findIndex(
    scene => scene.id === circle.onClickAction?.actionArgs
  );

  if (newIndex === -1) {
    console.warn("Scene not found for id:", circle.onClickAction?.actionArgs);
    isFading.value = false;
    return;
  }

  const newScene = store.$state.tour.scenes[newIndex];

  if (!newScene) {
    console.warn("newScene is undefined");
    isFading.value = false;
    return;
  }

  currentSceneIndex.value = newIndex;

  rotationRad.value = (newScene.rotation || 0) * Math.PI / 180;

  await setSceneTexture(newScene.background);

  allCircles.value = newScene.circles;
  store.setCurrentSceneIndex(newIndex);

  if (cameraRef.value) {
    cameraRef.value.fov = 50;
    cameraRef.value.updateProjectionMatrix();
  }

  isFading.value = false;
}



// ---------------------------
// Selection / TransformControls
// ---------------------------

// store all meshes by circle ID
const selectedCircleId = computed(() => store.$state.selectedCircle ? store.$state.selectedCircle.id : null);
const selectedMesh = ref<Mesh | null>(null);
const meshRefs: Record<string, Mesh | null> = {};
// watch circle selection
watch(selectedCircleId, (newId) => {
  if (newId && meshRefs[newId]) {
    selectedMesh.value = meshRefs[newId];
  }else {
    selectedMesh.value = null;
  }
});

//---------------------------
// Handle external scene index changes
//---------------------------
watch(() => store.$state.currentSceneIndex, async (newIndex) => {
  if (newIndex === currentSceneIndex.value) return;

  allCircles.value = [];
  isFading.value = true;

  const newScene = store.$state.tour.scenes[newIndex];
  rotationRad.value = (newScene.rotation || 0) * Math.PI / 180;

  setSceneTexture(newScene.background);

  isFading.value = false;

  allCircles.value = newScene.circles;
  currentSceneIndex.value = newIndex;
});

//---------------------------
// Handle rotation changes 
//---------------------------
watch(() => store.$state.tour.scenes[currentSceneIndex.value]?.rotation, (newRotation) => {
  
  if (newRotation !== undefined) {
    rotationRad.value = newRotation * Math.PI / 180;
  }
});


//---------------------------
// Handle changes in the background of the current scene
//---------------------------
watch(
  () => {
    const scene = store.$state.tour.scenes[currentSceneIndex.value];
    return scene ? scene.background : null;
  },
  (newBackground) => {
    if (!newBackground) return;

    console.log("Background change detected:", newBackground);

    if (newBackground !== currentSceneBackground.value) {
      setSceneTexture(newBackground);
    }
  }
);

// ---------------------------
// TransformControls change handler
// ---------------------------
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
  
  <div class="canvas-wrapper" ref="canvasElement" :class="{ fadeOut: isFading }">
    <div v-if="loadingTexture" class="loading-screen">
      <LoadingAnimation :loadingProgress="loadingProgress"/>
    </div>
    <TresCanvas :preserveDrawingBuffer="true" preset="realistic" clearColor="#ffffff" :antialias="true">    
      <TresPerspectiveCamera ref="cameraRef" :position="[0,0,0.5]" :far="10000" :fov="30" />
      <CameraControls 
        @end="updateCamera" 
        :maxDistance="3"
        :azimuthRotateSpeed="cameraSpeed"
        :polarRotateSpeed="cameraSpeed"
        />

      <!-- Skybox -->
      <TresMesh color="#ffffff" :position="[0,0,0]" :scale="[-30, 30, 30]" :rotation="[0,rotationRad,0]">
        <TresSphereGeometry :args="[1,100,100]" />
        <TresMeshBasicMaterial :key="currentSceneBackground" color="#ffffff" :map="currentTexture" :side="2" :toneMapped="false"/>
      </TresMesh>
      
      <!-- Circles -->
      <TresMesh v-for="circle in allCircles" :key="circle.id"
        :position="circle.coordinates"
        :scale="circle.scale"
        :rotation="[Math.PI/2,0,0]"
        @click="handleCircleClick(circle)"
        :ref="el => { if(el) meshRefs[circle.id] = el as unknown as Mesh }"
      >
      <TresCircleGeometry :args="[1,32]" />
      <TresMeshBasicMaterial
        :transparent="true"
        :opacity="0.8"
        :color="circle.color"
        :side="2"
      />
      </TresMesh>

      <!-- Circle Transform Arrows -->
      <TransformControls
        v-if="selectedMesh"
        :object="selectedMesh"
        @objectChange="handleTransformChange"
        @dragging="(e)=>{ cameraSpeed = e ? 0 : -0.2 }"
        mode="translate"
      />

      <!-- Circle Shadow -->
      <TresMesh v-for="circle in allCircles" :key="circle.id + 'Shadow'"
        :position="[circle.coordinates[0],circle.coordinates[1]-0.03,circle.coordinates[2]]"
        :scale="circle.scale"
        :rotation="[Math.PI/2,0,0]"
      >
        <TresCircleGeometry :args="[1,32]" />
        <TresMeshBasicMaterial
          :transparent="true"
          :opacity="0.3"
          :color="[0,0,0]"
          :side="2"
        />
      </TresMesh>      
      <!-- Ring  -->
      <Ring v-for="circle in allCircles" @click="handleCircleClick(circle)" :rotation="[Math.PI/2,0,0]" :args="[0.15*10*circle.scale, 0.2*10*circle.scale, 32]" :position="circle.coordinates">
          <TresMeshBasicMaterial  :transparent="true" :opacity="0.8" :color="circle.color" :side="2" />
      </Ring>
      
      <!-- Ring Shadow -->
      <Ring v-for="circle in allCircles" :rotation="[Math.PI/2,0,0]" :args="[0.15*10*circle.scale, 0.2*10*circle.scale, 32]" :position="[circle.coordinates[0],circle.coordinates[1]-0.03,circle.coordinates[2]]">
          <TresMeshBasicMaterial :transparent="true" :opacity="0.3" :color="circle.color" :side="2" />
      </Ring>
      
    </TresCanvas>
  </div>
</template>

<style scoped>
/* scene canvas fadeout animation */
.canvas-wrapper {
  display: block;
  top: 0;
  position: relative;
  width: 100%;
  height: 100%;
  transition: opacity .5s ease;
  opacity: 1;
}

.canvas-wrapper.fadeOut {
  opacity: 0;
}

.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0.8;
  z-index: 999;
  animation: fadeOutLoading 1s ease forwards 1.5s; /* fade out after 1.5s delay */
} 
.loading-txt{
  color: black;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5em;
}
</style>