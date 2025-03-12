<script setup>
import { RouterLink } from 'vue-router';


const props = defineProps({
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: null
    }
});


</script>


<template>
    <div class="card">
        <div class="card-header">
            <div class="card-header__icon">
                <!-- <Icon name="close" /> -->
            </div>
            <h3 class="card-header__title">Янги хабар</h3>
            <!-- <Icon name="close" class="card-header__close" /> -->
        </div>
        <p class="card-message">
            {{ message }}
        </p>
        <RouterLink v-if="link" :to="link" class="card-button">
            Батафсил
        </RouterLink>
    </div>

</template>

<style lang="scss" scoped>
.card {
    width: 380px;
    height: 130px;
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0px 4px 16px 0px rgba(165, 163, 174, 0.45);

}
</style>