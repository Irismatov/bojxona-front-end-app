<script setup>
import { ref } from "vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
    list: {
        type: Array,
        required: true
    }
})

const title = ref(formatDocName(props.list[0].type));
const slideIndex = ref(1);


const options = {
    type: 'loop',
    perPage: 1,
    pagination: false,
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


const onSlideChange = (splide, newIndex) => {
    title.value = formatDocName(props.list[newIndex].type);
    slideIndex.value = newIndex + 1;
}

</script>

<template>
    <div class="popup">
        <h1 class="popup-title">{{ title }}</h1>
        <Splide :options="options" aria-label="My Favorite Images" @splide:move="onSlideChange">
            <SplideSlide v-for="item in props.list">
                <a class="popup-image" :href="getBlobUrl(item.value)" target="_blank">
                    <img class="popup-image__inner" :src="`data:image/jpeg;base64,${item.value}`" alt="Sample 1">
                </a>
            </SplideSlide>
        </Splide>
        <p class="popup-page">{{ slideIndex }} / {{ props.list.length }}</p>
    </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.popup {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 16px;

    &-title {
        color: #4B465C;
        text-align: center;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "Public Sans";
        font-size: 26px;
        font-style: normal;
        font-weight: 600;
        line-height: 36px;
    }

    &-image {
        width: 100%;
        height: 280px;
        max-height: 280px;
        padding: 20px 0;
        border-radius: 6px;
        border-radius: 6px;
        display: block;

        &__inner {
            @include image(contain);
        }

    }
}

::v-deep() {
    .splide {
        --local-heigth: 350px;
        height: var(--local-heigth);

        &__arrow {
            svg {
                fill: black;
                height: 18px;
                width: 18px;
                opacity: 0.8;

                &:hover {
                    fill: black;
                    opacity: 1;
                }
            }

            
        }

        &__slide {

            &:not(.is-active) {
                opacity: 0;
            }
        }

        &__track {

        }

        &__pagination {
            counter-reset: pagination-num;
            display: flex;
            justify-content: center;
            align-items: center;

            &__page {
                width: 18px;
                height: 18px;
                background: #f0f0f0;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 5px;
                position: relative;

                &::after {
                    content: '';
                    width: 8px;
                    height: 8px;
                    background-color: transparent;
                    border-radius: 50%;
                }

                &:before {
                    counter-increment: pagination-num;
                    content: counter(pagination-num);
                    position: absolute;
                    font-size: 8px;
                    color: black;
                    z-index: 1;
                }

                &.is-active {
                    background-color: grey;

                    &:before {
                        color: white;
                    }
                }
            }

        }

    }
}
</style>