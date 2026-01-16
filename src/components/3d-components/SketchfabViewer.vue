<script setup lang="ts">

defineProps<{link: string | undefined }>()

</script>

<template>
  <div class="sketchfab">
    <iframe
      title=""
      frameborder="0"
      allowfullscreen
      width="99.9%"
      height="99.59%"
      mozallowfullscreen="true"
      webkitallowfullscreen="true"
      allow="autoplay; fullscreen; xr-spatial-tracking"
      xr-spatial-tracking
      execution-while-out-of-viewport
      execution-while-not-rendered
      web-share
      :src="link"
    />
  </div>
</template>

<style scoped>

.sketchfab{
    width: 100%;
    height: 100%;
}
 
</style>
