<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watchEffect } from "vue";
import {TransformControls} from "@tresjs/cientos";
import type { Mesh } from "three";
import { useTourStore } from "../../piniaStore/store";
import type { CircleInfo } from "../../types";

const props = defineProps<{
  circle:CircleInfo;
  selectedCircleId: string | null;
  meshRefs: Record<string, Mesh | null>;
}>();

const store = useTourStore();

// local ref to the mesh
const circleRef = ref<Mesh | null>(null);

// register this mesh into the shared refs
watchEffect(() => {
  if (circleRef.value) {
    props.meshRefs[props.circle.id] = circleRef.value;
  }
});

// cleanup when component unmounts
onBeforeUnmount(() => {
  delete props.meshRefs[props.circle.id];
});

// derived: is this circle selected?
const isSelected = computed(() => props.selectedCircleId === props.circle.id);

// click handler
function handleClick() {

  store.setSelectedCircle(props.circle); // example mutation
  const actionArgs = props.circle.onClickAction.actionArgs;
  const sceneIndex = store.$state.tour.scenes.findIndex(
    (scene) => scene.id === actionArgs
  );
  if (sceneIndex !== -1) store.setCurrentSceneIndex(sceneIndex);
}
</script>

<template>
  <TresMesh
    ref="circleRef"
    :position="props.circle.coordinates"
    :scale="props.circle.scale"
    :rotation="[Math.PI / 2, 0, 0]"
    @click="handleClick"
  >
    <TresCircleGeometry :args="[1, 32]" />
    <TresMeshBasicMaterial
      :color="isSelected ? 'yellow' : props.circle.color"
      :side="2"
    />
  </TresMesh>

  <!-- TransformControls if selected -->
  <TransformControls
    v-if="isSelected && circleRef"
    :object="circleRef"
    mode="translate"
  />
</template>
