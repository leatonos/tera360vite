<script setup lang="ts">

import type { CircleInfo } from '../../types';


const props = defineProps<{
    circleInfo:CircleInfo
}>()

</script>

<template>
    <!-- Flat disk -->
    <TresMesh :position="props.circleInfo.coordinates" :rotation="[Math.PI / 2, 0, 0]" :scale="props.circleInfo.scale">
      <TresCircleGeometry :args="[1, 32]" />
      <TresMeshBasicMaterial :color="props.circleInfo.color"  :side="2" />
    </TresMesh>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
#app {
  height: 100%;
  width: 100%;
  background-color: #000;
}
</style>
