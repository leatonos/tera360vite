<script setup lang="ts">
import type { Tour } from '../../types';

//Props
const props = defineProps<{
    thisTour:Tour
}>()

const link = `/tour/${props.thisTour._id}`

const thumbnailUrl = props.thisTour.scenes[0]?.thumbnail || 'https://placehold.co/150x100?text=No+thumbnail';

</script>

<template>
    <div class="tour-block" :style="{ backgroundImage: `url(${thumbnailUrl})` }">
        <div class="tour-block-overlay">
            <a class="black_text" :href="link">
                <h3 class="">{{ thisTour.name }}</h3>
            </a>
        </div>
    </div>
</template>

<style scoped>
    .black_text{
        color: black;
        text-decoration: none;
    }
    .tour-block{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: calc(33% - 10px);
        height: 20vh;
        border-radius: 5px;
        background-size: cover;
        background-position: center;
    }

    .tour-block-overlay{
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.3);
        height: 30%;
        padding-left: 10px;
       
    }
</style>
