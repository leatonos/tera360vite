<script setup lang="ts">
import Scene from './components/Scene.vue';
import TuorEditor from './components/editor-components/TourEditor.vue';
</script>

<template>
  <div class="main-container">
    <div class="tuor-editor">
      <TuorEditor/>
    </div>
    <div class="canvas">
        <Suspense>
          <Scene/>
        </Suspense>
    </div>
  </div>
</template>

<style scoped>
.main-container{
  display: flex;
  background-color: yellow;
  flex-direction: row;
  width: 100vw;
  height: 100vh;
}
.tuor-editor{
  background-color: white;
  width: 20%;
  height: 100vh;
}
.canvas{
  background-color: aquamarine;
  width: 80%;
  height: 100vh;
}
</style>
