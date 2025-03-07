<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { Form, CheckboxGroup, Checkbox, Textarea, FormItem, message } from "ant-design-vue";

import { useRoute } from "vue-router";
import { useModal, useDeclarations } from "@/utils/composable";
import axios from "@/plugins/axios";

import { Swiper, SwiperSlide } from "swiper/vue";
import 'swiper/css';
import "swiper/css/navigation";

import { EffectCreative, Autoplay, Navigation } from "swiper/modules";
const options = {
  modules: [EffectCreative, Navigation],
  slidesPerView: 1,
  speed: 1000,
  grabCursor: true,
  navigation: {
    nextEl: ".docs-navigation__btn.next",
    prevEl: ".docs-navigation__btn.prev"
  }
};

const swiperRef = ref({});


const route = useRoute();
const { openModal: openCancelModal, open: openCancel, closeModal: closeCancelModal } = useModal();
const { openModal: openApplyModal, open: openApply, closeModal: closeApplyModal } = useModal();
const { isLoading, changeDeclarationStatus, formatType } = useDeclarations();

const data = ref({});
const cancelOptions = ref([]);


const applySelectOptions = ref([
  {
    value: '1',
    label: 'Bitta dokument',
  }
]);

const applySelectValue = ref("1");

const documents = reactive([]);
const title = ref(formatDocName(documents[0]?.type));
const slideIndex = ref(1);
const selectedDocType = ref(undefined)
const docTypeOptions = ref([
  {
    value: 'passports',
    label: 'Пасспортлар'
  },
  {
    value: 'techpassports',
    label: 'Техпаспортлар'
  },
  {
    value: 'crm',
    label: 'СРМ'
  },
  {
    value: 'unofficial',
    label: 'Нотариф хужжатлар'
  }
]);

const splideOptions = {
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
  title.value = formatDocName(documents[newIndex].type);
  slideIndex.value = newIndex + 1;
}


// rasmni yuklash uchun bu qismi o'chirib yuboriladi
const file = ref(null);
const preview = ref(null);
const declType = ref(0);

async function requestToChangeStatus() {
  await changeDeclarationStatus(route.params.id, 3, "Murojaat rasmiylashtirildi");
  closeApplyModal();
}

async function fetchData() {
  const response = await axios.get(`/api/declarations/${route.params.id}`);
  if (response.data.resultCode === 0) {
    data.value = response.data;
  } else {
    message.error("Xatolik yuz berdi");
  }
}


async function fetchDocs(docIds) {
  for (const doc of docIds) {
    const response = await axios.get(`/declaration-docs/${doc}`);

    if (response.data.resultCode === 0) {
      documents.push({
        value: response.data.value,
        type: response.data.type
      });
    }
  }
}

const toggleDocument = async (type) => {
  if (type === "passports") {
    for (const item of data.value.documents) {
      if (item.type === 0 || item.type === 1) {
        const response = await axios.get(`/declaration-docs/${item.id}`);
        documents.push(
          {
            type: response.data.type,
            value: response.data.value
          }
        )
      }
    }
  } else {
    documents.length = 0;
  }

};


const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;

    // Rasmni oldindan ko'rish uchub
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    }
    reader.readAsDataURL(selectedFile);
  }
}

const uploadImage = async () => {
  if (!file.value) {
    message.warn("Iltimos, rasm yuklang!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("type", declType.value);

  try {
    const response = await axios.post(`/declaration-docs/${route.params.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    fetchData();
    message.success("Rasm yuklandi");
  } catch (error) {
    message.error("Xatolik yuz berdi");
    console.error("Xatolik", error);
  }
}

onMounted(() => {
  fetchData();
})
</script>

<template>
  <!-- rasm yuklash uchun bu qismi ochirib yuboriladi -->
  <div class="upload">
    <input type="file" @change="handleFileChange" accept="image/*" />
    <input type="number" v-model="declType" max="3" min="0" value="0" />
    <Button @click="uploadImage">Rasmni yuklash</Button>
    <div v-if="preview">
      <h3>Tanlangan rasm: </h3>
      <img :src="preview" width="200" />
    </div>
  </div>

  <Card title="Маълумотлар">
    <ARow :gutter="[12, 12]">
      <ACol span="6">
        <ARow :gutter="[12, 12]">
          <ACol span="24">
            <Info label="Мурожаат тури" :value="formatType(data.type) || '-'" />
          </ACol>
          <ACol span="24">
            <Info label="Мурожаат рақами" :value="data.declNumber || '-'" />
          </ACol>
          <ACol span="24">
            <Info label="Мурожаат вақти" :value="data.createdAt || '-'" />
          </ACol>
          <ACol span="24">
            <Info label="Мурожаат давомийлиги" :value="data.duration || '-'" />
          </ACol>
          <ACol span="24">
          </ACol>
        </ARow>
      </ACol>
      <ACol span="9">
        <div class="docs">
          <div class="docs-header">
            <h1 class="docs-title">Хужжатлар</h1>
            <Select class="docs-select" ref="select" v-model:value="selectedDocType" :options="docTypeOptions"
              @change="toggleDocument"></Select>
          </div>
          <div class="docs-slider" v-if="documents.length > 0">
            <div class="docs-navigation">
              <button class="docs-navigation__btn prev">
                <Icon name="angle-prev" />
              </button>
              <button class="docs-navigation__btn next">
                <Icon name="angle-next" />
              </button>
            </div>
            <Swiper v-bind="options" @swiper="(swiper) => swiperRef = swiper">
              <SwiperSlide v-for="item in documents">
                <h2 class="docs-slider__name">{{ formatDocName(item.type) }}</h2>
                <a class="docs-slider__image" :href="getBlobUrl(item.value)" target="_blank">
                  <img :src="`data:image/jpeg;base64,${item.value}`" alt="Sample 1">
                </a>
              </SwiperSlide>
            </Swiper>
            <div class="docs-page">
              {{ swiperRef.activeIndex + 1 }} / {{ documents.length }}
            </div>
          </div>
        </div>
      </ACol>
      <ACol span="9">
        <div class="docs">
          <h1>Хабарлар</h1>
        </div>
      </ACol>
    </ARow>
  </Card>

  <Card title="Расмийлаштириш">
    <Form layout="vertical">
      <ARow :gutter="[20, 20]">
        <ACol span="8">
          <FormItem>
            <Input />
          </FormItem>
        </ACol>
        <ACol span="8">
          <FormItem>
            <Input />
          </FormItem>
        </ACol>
        <ACol span="8">
          <FormItem>
            <Input />
          </FormItem>
        </ACol>
      </ARow>
      <div class="form-action">
        <Button class="form-action__btn _1" color="#EA5455" @click="openCancelModal">Қайтариш</Button>
        <Button class="form-action__btn _2" @click="openApplyModal">Расмийлаштириш</Button>
      </div>
    </Form>
  </Card>
  <Modal :open="openCancel" @cancel="closeCancelModal" title="Диққат"
    subtitle="Ушбу мурожаатни нима сабабдан қайтармоқчисиз?">
    <div class="modal modal-cancel">
      <div class="modal-actions">
        <div class="modal-actions__checkbox">
          <CheckboxGroup v-model:value="cancelOptions" style="width: 100%">
            <ARow :gutter="[8, 8]">
              <ACol :span="24">
                <Checkbox value="documentIsNotValid">Ҳужжат тўлиқ тақдим этилмаган</Checkbox>
              </ACol>
              <ACol :span="24">
                <Checkbox value="imageIsNotValid">Сурат яхши эмас</Checkbox>
              </ACol>
              <ACol :span="24">
                <Checkbox value="applicantIsNotResponding">Мурожаатчи жавоб бермаяпти</Checkbox>
              </ACol>
              <ACol :span="24">
                <Checkbox value="other">Бошқа</Checkbox>
              </ACol>
              <ACol :span="24">
                <Textarea :rows="3" placeholder="Бошқа сабаб киритинг" :disabled="!cancelOptions.includes('other')">
              </Textarea>
              </ACol>
            </ARow>
          </CheckboxGroup>
        </div>
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF"
            @click="closeCancelModal">Ортга</Button>
          <Button color="#EA5455">Қайтариш</Button>
        </div>
      </div>
    </div>
  </Modal>

  <Modal :open="openApply" @cancel="closeApplyModal" title="Диққат"
    subtitle="Сиз ушбу мурожаатни расмийлаштирмоқчимисиз">
    <div class="modal modal-apply">
      <!-- <p class="modal-apply__text">Танланг: </p>
      <Select ref="select" v-model:value="applySelectValue" :options="applySelectOptions" @focus="focus"
        @change="handleChange"></Select> -->

      <div class="modal-actions">
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" @click="closeApplyModal"
            borderColor="#FFF">ЙЎҚ</Button>
          <Button @click="requestToChangeStatus">ҲА</Button>
        </div>
      </div>
    </div>
  </Modal>

</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.form {
  &-action {
    display: flex;
    gap: 20px;

    &__btn {
      &._1 {
        margin-left: auto;
      }
    }
  }
}

.modal {

  &-actions {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__btns {
      display: flex;
      gap: 10px;
      margin-left: auto;
    }

    &__checkbox {
      ::v-deep() {
        .ant {
          &-checkbox {
            &-wrapper {
              span {
                color: #4B465C;
                font-feature-settings: 'liga' off, 'clig' off;
                font-family: "Public Sans";
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 21px;
              }
            }
          }
        }
      }
    }
  }

  &-apply {

    &__text {
      color: #4B465C;
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: "Public Sans";
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 4px;
    }

    ::v-deep() {
      .ant {
        &-select {
          width: 200px;

          &:hover .ant-select-selector {
            border: 1px solid #7367F0 !important;
          }

          &-selector {
            border-radius: 4px;
            border: 1px solid #7367F0;
            background: #FFF;

            .ant-select:hover & {
              border: 1px solid #7367F0;
            }
          }

          &-selection {
            &-item {
              color: #4B465C;
              font-feature-settings: 'liga' off, 'clig' off;
              font-family: "Public Sans";
              font-size: 13px;
              font-style: normal;
              font-weight: 400;
              line-height: 21px;
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}

.docs {
  width: 576px;
  height: calc(var(--height-info)*4 + 12px*3);
  max-height: calc(var(--height-info)*4 + 12px*3);
  border-radius: 6px;
  box-shadow: 0px 4px 18px 0px rgba(75, 70, 92, 0.1);
  padding: 0 16px;
  --local-header-height: 50px;
  --local-docs-height: 450px;
  --local-docs-page-height: 50px;


  &-header {
    display: flex;
    min-height: var(--local-header-height);
    display: flex;
    align-items: center;
  }

  &-title {
    color: #4B465C;
    font-feature-settings: 'liga' off, 'clig' off;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-right: auto;
  }

  &-slider {
    max-width: 100%;
    height: calc(var(--local-docs-height) - var(--local-header-height) - var(--local-docs-page-height));
    max-height: calc(var(--local-docs-height) - var(--local-header-height) - var(--local-docs-page-height));
    position: relative;

    &__name {
      color: #4B465C;
      font-feature-settings: 'liga' off, 'clig' off;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      text-align: center;
    }

    &__image {
      display: block;
      width: 100%;
      height: 316px;
      max-height: 316ps;

      img {
        @include image(contain);
      }
    }
  }

  &-page {
    margin-top: 12px;
    text-align: center;
    color: #4B465C;
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "Public Sans";
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
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
      background: #4B4B4B;
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
        border: 1px solid #4B4B4B;
        background-color: var(--white-1);

        .icon {
          --icon-color: #4B4B4B;
        }
      }

      .icon {
        --icon-color: #fff;
        --icon-size: 20px;
      }

    }
  }

}
</style>