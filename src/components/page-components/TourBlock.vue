<script setup lang="ts">
import type { Tour } from '../../types';



//Props
const props = defineProps<{
    thisTour:Tour
}>()


</script>



<template>
    <div class="">
        <h2>{{ props.thisTour.name }}</h2>
    </div>
</template>

<style>
</style>
