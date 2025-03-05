<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import 'swiper/css';
import 'swiper/css/navigation';

const props = defineProps({
    list: {
        type: Array,
        required: true
    }
})


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

const options = {
    type: 'loop',
    perPage: 1,
    pagination: true,
};

</script>

<template>
    <Modal title="Hujjatlar" class="popup" :width="400" :forceRender="true"
        :bodyStyle="{ height: '400px', maxHeight: '400px' }">
        <div class="popup-container">
            <Splide :options="options" aria-label="My Favorite Images">
                <SplideSlide v-for="item in props.list">
                    <h1 class="popup-title">{{ formatDocName(item.type) }}</h1>
                    <a class="popup-image" :href="getBlobUrl(item.value)" target="_blank">
                        <img class="popup-image__inner" :src="`data:image/jpeg;base64,${item.value}`" alt="Sample 1">
                    </a>
                </SplideSlide>
                <SplideSlide class="popup-image">
                    <img class="popup-image__inner" src="/images/doc-2.jpg" alt="Sample 2">
                </SplideSlide>
            </Splide>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.popup {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &-title {
        color: #4B465C;
        text-align: center;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "Public Sans";
        font-size: 26px;
        font-style: normal;
        font-weight: 600;
        line-height: 36px;
        margin-bottom: 20px;
    }

    &-image {
        width: 100%;
        max-height: 350px;
        padding: 20px 0;


        &__inner {
            @include image(contain);
            max-height: 300px;
            object-position: center;
        }
    }
}

::v-deep() {
    .splide {
        --local-heigth: 400px;

        height: var(--local-heigth);

        &__slide {
            height: var(--local-heigth);
        }

        &__track {
            height: var(--local-heigth);
        }

        &__pagination {
            counter-reset: pagination-num;
            display: flex;
            justify-content: center;
            align-items: center;

            &__page {
                width: 30px;
                height: 30px;
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
                    font-size: 14px;
                    color: black;
                    z-index: 1;
                }

                &.is-active {
                    background-color: #007bff;

                    &:before {
                        color: white;
                    }
                }
            }

        }

    }

    .splide__pagination {}

    .splide__pagination__page {


        // Nuqtalarni yashirish
        &::after {
            content: '';
            width: 8px;
            height: 8px;
            background-color: transparent;
            border-radius: 50%;
        }
    }

    .splide__pagination__page:before {
        counter-increment: pagination-num;
        content: counter(pagination-num);
        position: absolute;
        font-size: 14px;
        color: black;
        z-index: 1;
    }

    .splide__pagination__page.is-active {
        background-color: #007bff;

        &:before {
            color: white;
        }
    }
}
</style>