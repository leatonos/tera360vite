<script setup lang="ts">
import type { Tour } from '../../types';

//Props
const props = defineProps<{
    thisTour:Tour
}>()

const link = `/tour/${props.thisTour._id}`

</script>

<template>
    <div class="tour-block">
        <a :href="link">
            <h3>{{ thisTour.name }}</h3>
        </a>
    </div>
</template>

<style>
    a{
        text-decoration: none;
        color: black;
    }
    h2{
        color :black;
    }
    .tour-block{
        display: block;
        text-align: center;
        width: 100px;
        border: 2px solid black;
        padding: 1rem;
        border-radius: 3px;
    }
</style>
