<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";

// Import required Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const options = {
    modules: [Navigation],
    slidesPerView: 1,
    speed: 1000,
    navigation: true, // Enable navigation
    spaceBetween: 30, // Add space between slides
};

const data = {
    title: "CMR Hujjati",
    images: [
        "/images/doc-1.jpg",
        "/images/doc-2.jpg"
    ]
}

const swiperRef = ref('');

</script>

<template>
    <Modal class="popup" :width="400">
        <div class="popup-header">
            <h4 class="popup-header__title">{{ data.title }}</h4>
            <button class="popup-header__btn">
                <Icon name="printer" />
            </button>
            <button class="popup-header__btn">
                <Icon name="download" />
            </button>
        </div>
        <div class="swiper-container">
            <Swiper v-bind="options" @swiper="(swiper) => swiperRef = swiper">
                <SwiperSlide v-for="(item, index) in data.images" :key="index">
                    <a class="popup-image" :href="item" target="_blank">
                        <img class="popup-image__inner" :src="item" alt="Slide image">
                    </a>
                    <span class="swiper-page">{{ swiperRef.activeIndex + 1 }} / {{ data.images.length }}</span>
                </SwiperSlide>
            </Swiper>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.popup {
    display: flex;
    flex-direction: column;
    justify-content: center;


    &-header {
        right: 20px;
        top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 24px;

        &__title {
            color: #4B465C;
            text-align: center;
            font-feature-settings: 'liga' off, 'clig' off;
            font-family: "Public Sans";
            font-size: 26px;
            font-style: normal;
            font-weight: 600;
            line-height: 36px;
            margin: 0 auto;
        }


        &__btn {
            @include btn-clean;

            .icon {
                --icon-color: #4B465C;
                --icon-size: 24px;
            }
        }
    }

    &-image {
        display: block;
        width: 250px;

        &__inner {
            @include image(contain);
            width: 100%;
            height: 100%;
        }
    }
}

// Add Swiper-specific styles
.swiper {
    &-container {
        width: 100%;
        height: 100%;
        position: relative;
    }

    &-page {
        color: var(--Light-Typography-Color-Body-Text, #4B465C);
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "Public Sans";
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}

:deep(.swiper) {
    width: 100%;
}

:deep(.swiper-slide) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: #4B465C;
    --swiper-navigation-size: 30px;
}
</style>