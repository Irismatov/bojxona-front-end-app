<script setup>
import "swiper/css";
import "swiper/css/navigation";
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectCreative, Navigation } from "swiper/modules";
import axios from "@/plugins/axios";
import { getBlobUrl } from "@/utils/mixins";
import { useModal } from "@/utils/composable";

const { open, toggleModal } = useModal();
const props = defineProps({
  documents: {
    type: Array,
    required: true,
  },
});

const list = ref([]);
const loading = ref(false);
const swiperRef = ref(null); // Swiper instance
const currentIndex = ref(0); // Reaktiv activeIndex

const options = {
  modules: [EffectCreative, Navigation],
  slidesPerView: 1,
  speed: 1000,
  grabCursor: true,
  navigation: {
    nextEl: ".slider-navigation__btn.slider-navigation__next",
    prevEl: ".slider-navigation__btn.slider-navigation__prev",
  },
};

const types = [
  {
    type: "passports",
    numbers: [0, 1],
  },
  {
    type: "tech",
    numbers: [2, 3],
  },
  {
    type: "licence",
    numbers: [4]
  },
  {
    type: "cmr",
    numbers: [5]
  },
  {
    type: "invoice",
    numbers: [6]
  },
  {
    type: "unauthorized",
    numbers: [7]
  },
  {
    type: "insurance",
    numbers: [8]
  }
];

const fileTitles = [
  {
    title: "Паспорт олди",
    type: 0
  },
  {
    title: "Паспорт орқа",
    type: 1
  },
  {
    title: "Техпаспорт олди",
    type: 2
  },
  {
    title: "Техпаспорт орқа",
    type: 3
  },
  {
    title: "Юк ташиш рухсатномаси",
    type: 4
  },
  {
    title: "CMR ҳужжати",
    type: 5
  },
  {
    title: "Инвойс ҳужжатлар",
    type: 6
  },
  {
    title: "Нотариф ҳужжатлар",
    type: 7
  },
  {
    title: "Кафолат ҳужжатлар",
    type: 8
  },

]

const fetchData = (type) => {
  loading.value = true;
  toggleModal(true);
  types.forEach(async (item) => {
    if (item.type !== type) return;
    const filteredDecs = props.documents.filter((el) => item.numbers.includes(el.docType)).map((el) => el.docsOrders).flat();

    const promises = filteredDecs.map((el) => axios.get(`/declaration_docs/id/${el.docId}`));

    // const promises = props.documents
    //   .filter((el) => item.numbers.includes(el.docType))
    //   .map((el) => axios.get(`/declaration-docs/${el.id}`));
    try {
      const response = await Promise.all(promises);
      list.value = response.map((el) => el.data) || [];
      console.log(list.value);
    } catch (e) {
      console.error(e, "something wrong");
    } finally {
      loading.value = false;
    }
  });
};

function getFileTitle(type) {
  const item = fileTitles.find((el) => el.type === type) || {};
  return item.title;
}

function getImage(url) {
  return `data:image/jpeg;base64,${url}`;
}
const onSwiper = (swiper) => {
  swiperRef.value = swiper;
  swiper.on("slideChange", () => {
    currentIndex.value = swiper.activeIndex;
  });
};

function onClose() {
  currentIndex.value = 0;
  list.value = [];
  swiperRef.value = null;
  toggleModal(false);
}

defineExpose({ fetchData });
</script>

<template>
  <ADrawer :open="open" @close="onClose" :width="900">
    <div class="slider">
      <ASpin v-if="loading"></ASpin>
      <template v-else>
        <div class="slider-navigation">
          <button class="slider-navigation__btn slider-navigation__prev">
            <Icon name="angle-prev" />
          </button>
          <button class="slider-navigation__btn slider-navigation__next">
            <Icon name="angle-next" />
          </button>
        </div>
        <div class="slider-images__wrapper">
          <Swiper v-bind="options" @swiper="onSwiper" class="slider-images">
            <SwiperSlide v-for="item in list" :key="item.id">
              <h2 class="slider-images__name">{{ getFileTitle(item.docType) }}</h2>
              <a class="slider-images__image" :href="getBlobUrl(item.image)" target="_blank"
                :style="`--local-image: url('${getImage(item.image)}')`">
                <img :src="getImage(item.image)" :alt="getFileTitle(item.docType)" />
              </a>
            </SwiperSlide>
          </Swiper>
        </div>
        <div class="slider-pagination">
          {{ currentIndex + 1 }} / {{ list.length }} <!-- documents.length o‘rniga list.length -->
        </div>
      </template>
    </div>
  </ADrawer>
</template>

<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.slider {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  &-images {
    &__name {
      color: #4b465c;
      font-feature-settings: "liga" off, "clig" off;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
      margin-bottom: 16px;
    }

    &__image {
      display: block;
      width: 100%;
      height: 75vh;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-image: var(--local-image);

      img {
        display: block;
        @include image(contain);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
      }
    }
  }

  &-navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 8px;
    right: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 0px;
    z-index: 999;

    &__btn {
      @include btn-clean;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: #4b4b4b;
      backdrop-filter: blur(10px);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      transition: all 0.2s ease-in-out;

      &.swiper-button-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:not(.swiper-button-disabled):hover {
        border: 1px solid #4b4b4b;
        background-color: var(--white-1);

        .icon {
          --icon-color: #4b4b4b;
        }
      }

      .icon {
        --icon-color: #fff;
        --icon-size: 20px;
      }
    }
  }

  &-pagination {
    margin-top: 12px;
    text-align: center;
    color: #4b465c;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
  }
}
</style>
