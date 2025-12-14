<script setup lang="ts">

    const props = defineProps<{ 
        title: string;
        isAdmin?: boolean;
    }>();

</script>

<template>
       <header>
            <div class="logo-container">
                <a href="https://tera.arq.br" target="_blank" rel="noopener noreferrer">
                    <img class="animated-logo" src="../../assets/teraLogoBranco.svg" />
                </a>
            </div>
            <div class="header-title">
                <h1 class="white-text">{{ props.title }}</h1>
            </div>
            <div v-if="props.isAdmin" class="header-options">
                <a href="/tour-creator" class="creator-link">Create new tour</a>
            </div>
        </header>
</template>

<style scoped>

    header{
        padding: 15px 0px;
        width: 100%;
        background-color: #242424;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2rem;
    }

    .logo-container{
        width: 120px;
        margin-left: 1rem;
    }
    .animated-logo{
        width: 100%;
        margin-left: 1rem;
    }

    .header-title{
        width: 200px;
        padding-left: 40px;
    }

    .header-options{
        text-align: right;
        width: calc(100% - 500px);
    }

    .creator-link{
        background-color: #ffffff;
        color: #242424;
        padding: 8px 12px;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
    }

    .white-text{
        color: white;
        padding: 3.2px;
        font-size: 1em;
    }

    .header-options{
        justify-self: right;
    }


    /* Medium devices (tablets) */
    @media (max-width: 992px) {
       
    }


    /* Small devices (phones) */
    @media (max-width: 576px) {
 
    }


</style>
