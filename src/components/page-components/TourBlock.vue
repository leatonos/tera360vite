<script setup lang="ts">
import type { Tour } from '../../types';
import { computed, ref } from 'vue';

//Props
const props = defineProps<{
    thisTour:Tour
}>()

const selectedImageIndex = ref(0);

const link = `/tour/${props.thisTour._id}`


const thumbnailUrl = computed(() => {
  return (
    props.thisTour.scenes[selectedImageIndex.value]?.thumbnail ||
    "https://placehold.co/150x100?text=No+thumbnail"
  );
});



const changeImage = (index:number) =>{
    selectedImageIndex.value = index;
    console.log("Changed image to index:", index);
}


</script>

<template>
    <div class="tour-block-container">
        <div class="tour-block" :style="{ backgroundImage: `url(${thumbnailUrl})` }">
            <div class="tour-block-overlay">
                <a class="black_text" :href="link">
                    <h3 class="tour-title">{{ thisTour.name }}</h3>
                </a>
            </div>
        </div>
        <div class="tour-gallery-small">
            <div v-for="(scene, index) in thisTour.scenes" :key="scene.id" class="small-scene-thumb" @click="changeImage(index)"
            :style="{ backgroundImage: `url(${scene.thumbnail || 'https://placehold.co/100x70?text=No+thumbnail'})` }">
            </div>
        </div>
        <a class="tour_btn" :href="link">Ver tour</a>
    </div>
</template>

<style scoped>

    .tour-block-container{
        display: flex;
        width: calc(33% - 10px);
        flex-direction: column;
    }
    .black_text{
        text-decoration: none;
        position: relative;
        color: black;
    }
    .tour-gallery-small{
        display: none;
    }
    .tour-block{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 100%;
        height: 20vh;
        border-radius: 5px;
        background-size: cover;
        background-position: center;
    }

    .tour-block-overlay{
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
        height: 30%;
        padding-left: 10px;        
    }

    .tour_btn{
        display: none;
    }

    .tour-title{
        color: white;
        margin: 0;
        text-decoration: none;
    }

    /* Medium devices (tablets) */
    @media (max-width: 992px) {
        .tour-block-container{
            width: calc(50% - 10px);
        }
        .tour-gallery-small{
            display: flex;
            height: 60px;
            gap: 5px;
            margin-top: 5px;
            overflow-x: auto;
        }
        .small-scene-thumb{
            width: 100px;
            background-color: black;
            background-size: cover;
            background-position: center;
            border-radius: 3px;
            flex-shrink: 0;
        }
        .tour_btn{
            display: block;
            margin-top: 10px;
            padding: 10px;
            text-decoration: none;
            border-radius: 5px;
            background-color: #242424;

        }
    }


    /* Small devices (phones) */
    @media (max-width: 576px) {
    .tour-block-container{
            width: calc(100% - 10px);
        }
        .tour-block{
            height: 25vh;
        }
    }


</style>
