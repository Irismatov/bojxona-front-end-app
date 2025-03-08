<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { useModal, useDeclarations } from "@/utils/composable";
import axios from "@/plugins/axios";
import DocumentsDrawer from "@/components/local/drawer/documents.vue";
const documentsDrawerRef = ref();
const route = useRoute();
const {
  openModal: openCancelModal,
  open: openCancel,
  closeModal: closeCancelModal,
} = useModal();
const {
  openModal: openApplyModal,
  open: openApply,
  closeModal: closeApplyModal,
} = useModal();
const { isLoading, changeDeclarationStatus, formatType } = useDeclarations();

const data = ref({});
const cancelOptions = ref([]);

const applySelectOptions = ref([
  {
    value: "1",
    label: "Bitta dokument",
  },
]);

const applySelectValue = ref("1");



// rasmni yuklash uchun bu qismi o'chirib yuboriladi
const file = ref(null);
const preview = ref(null);
const declType = ref(0);

async function requestToChangeStatus() {
  await changeDeclarationStatus(
    route.params.id,
    3,
    "Murojaat rasmiylashtirildi"
  );
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

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;

    // Rasmni oldindan ko'rish uchub
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  }
};

const uploadImage = async () => {
  if (!file.value) {
    message.warn("Iltimos, rasm yuklang!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("type", declType.value);

  try {
    const response = await axios.post(
      `/declaration-docs/${route.params.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    fetchData();
    message.success("Rasm yuklandi");
  } catch (error) {
    message.error("Xatolik yuz berdi");
    console.error("Xatolik", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div>
    <div class="upload">
      <input type="file" @change="handleFileChange" accept="image/*" />
      <input type="number" v-model="declType" max="3" min="0" value="0" />
      <Button @click="uploadImage">Rasmni yuklash</Button>
      <div v-if="preview">
        <h3>Tanlangan rasm:</h3>
        <img :src="preview" width="200" />
      </div>
    </div>
    <Card title="Маълумотлар">
      <ARow :gutter="[12, 24]">
        <ACol span="6">
          <Info label="Мурожаат тури" :value="formatType(data.type) || '-'" />
        </ACol>
        <ACol span="6">
          <Info label="Мурожаат рақами" :value="data.declNumber || '-'" />
        </ACol>
        <ACol span="6">
          <Info label="Мурожаат вақти" :value="data.createdAt || '-'" />
        </ACol>
        <ACol span="6">
          <Info label="Мурожаат давомийлиги" :value="data.duration || '-'" />
        </ACol>
        <ACol span="24">
          <Info label="Hujjatlar" color-value="#7367F0">
            <template #value>
              <div class="docs-links">
                <a
                  @click="documentsDrawerRef.fetchData('passports')"
                  class="docs-links__item"
                  >Пасспортлар</a
                >
                <!-- <a @click="toggleDocument('passports')" class="docs-links__item"
                  >Пасспортлар</a
                > -->
                <!-- <a
                  @click="toggleDocument('techpassports')"
                  class="docs-links__item"
                  >Техпаспортлар</a
                >
                <a
                  @click="toggleDocument('unauthorized')"
                  class="docs-links__item"
                  >Нотариф хужжатлар</a
                >
                <a @click="toggleDocument('crm')" class="docs-links__item"
                  >СРМ</a
                > -->
              </div>
            </template>
          </Info>
        </ACol>
        <ACol span="auto" style="display: flex; gap: 10px">
          <Button
            class="form-action__btn _1"
            color="#EA5455"
            @click="openCancelModal"
            >Қайтариш</Button
          >
          <Button class="form-action__btn _2" @click="openApplyModal"
            >Расмийлаштириш</Button
          >
        </ACol>
      </ARow>
    </Card>

    <Modal
      :open="openCancel"
      @cancel="closeCancelModal"
      title="Диққат"
      subtitle="Ушбу мурожаатни нима сабабдан қайтармоқчисиз?"
    >
      <div class="modal modal-cancel">
        <div class="modal-actions">
          <div class="modal-actions__checkbox">
            <ACheckboxGroup v-model:value="cancelOptions" style="width: 100%">
              <ARow :gutter="[8, 8]">
                <ACol :span="24">
                  <ACheckbox value="documentIsNotValid"
                    >Ҳужжат тўлиқ тақдим этилмаган</ACheckbox
                  >
                </ACol>
                <ACol :span="24">
                  <ACheckbox value="imageIsNotValid">Сурат яхши эмас</ACheckbox>
                </ACol>
                <ACol :span="24">
                  <ACheckbox value="applicantIsNotResponding"
                    >Мурожаатчи жавоб бермаяпти</ACheckbox
                  >
                </ACol>
                <ACol :span="24">
                  <ACheckbox value="other">Бошқа</ACheckbox>
                </ACol>
                <ACol :span="24">
                  <ATextarea
                    :rows="3"
                    placeholder="Бошқа сабаб киритинг"
                    :disabled="!cancelOptions.includes('other')"
                  >
                  </ATextarea>
                </ACol>
              </ARow>
            </ACheckboxGroup>
          </div>
          <div class="modal-actions__btns">
            <Button
              bgColor="rgba(168, 170, 174, 0.16)"
              color="#A8AAAE"
              borderColor="#FFF"
              @click="closeCancelModal"
              >Ортга</Button
            >
            <Button color="#EA5455">Қайтариш</Button>
          </div>
        </div>
      </div>
    </Modal>

    <Modal
      :open="openApply"
      @cancel="closeApplyModal"
      title="Диққат"
      subtitle="Сиз ушбу мурожаатни расмийлаштирмоқчимисиз"
    >
      <div class="modal modal-apply">
        <!-- <p class="modal-apply__text">Танланг: </p>
      <Select ref="select" v-model:value="applySelectValue" :options="applySelectOptions" @focus="focus"
        @change="handleChange"></Select> -->

        <div class="modal-actions">
          <div class="modal-actions__btns">
            <Button
              bgColor="rgba(168, 170, 174, 0.16)"
              color="#A8AAAE"
              @click="closeApplyModal"
              borderColor="#FFF"
              >ЙЎҚ</Button
            >
            <Button @click="requestToChangeStatus">ҲА</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
  <DocumentsDrawer :documents="data.documents || []" ref="documentsDrawerRef" />
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

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
                color: #4b465c;
                font-feature-settings: "liga" off, "clig" off;

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
      color: #4b465c;
      font-feature-settings: "liga" off, "clig" off;

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
            border: 1px solid #7367f0 !important;
          }

          &-selector {
            border-radius: 4px;
            border: 1px solid #7367f0;
            background: #fff;

            .ant-select:hover & {
              border: 1px solid #7367f0;
            }
          }

          &-selection {
            &-item {
              color: #4b465c;
              font-feature-settings: "liga" off, "clig" off;

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
</style>
