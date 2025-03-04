<script setup>
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
    list: {
        type: Array,
        required: true
    }
})

const options = {
    modules: [Navigation],
    slidesPerView: 1,
    speed: 500,
    navigation: true,
    spaceBetween: 30,
};

function formatDocName(type) {
    if (type === 0) {
        return "Паспорт олди"
    } else if (type === 1) {
        return "Паспорт орка"
    } else if (type === 2) {
        return "Техпаспорт олди"
    } else if (type === 3) {
        return "Техпаспорт орка"
    } else if (type === 4) {
        return "Юк ташиш рухсатномаси"
    } else {
        return type
    }
}

function getBlobUrl(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
}


const swiperRef = ref('');
</script>

<template>
    <Modal title="Hujjatlar" class="popup" :width="500">
        <div class="swiper-container">
            <Swiper v-bind="options" @swiper="(swiper) => swiperRef = swiper">
                <SwiperSlide v-for="(item, index) in props.list" :key="index">
                    <div class="popup-header">
                        <h4 class="popup-header__title">{{ formatDocName(item.type) }}</h4>
                    </div>
                    <a class="popup-image" :href="getBlobUrl(item.value)" target="_blank">
                        <img class="popup-image__inner" :src="`data:image/jpeg;base64,${item.value}`">
                    </a>
                    <span class="swiper-page">{{ swiperRef.activeIndex + 1 }} / {{ props.list.length }}</span>
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
    }

    &-image {
        height: 100%;
        width: calc(100% - (30px * 2));
        margin-bottom: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        &__inner {
            @include image(contain);
        }
    }
}


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
    height: calc(100vh - (100px * 2));
    width: calc(100% - (20px * 2));
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: red;
    --swiper-navigation-size: 20px;
    --swiper-navigation-offset: 0px;
}
</style>