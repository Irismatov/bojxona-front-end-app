<script setup>
import { ref, onMounted, computed, reactive, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useModal, useDeclarations } from "@/utils/composable";
import axios from "@/plugins/axios";
import DocumentsDrawer from "@/components/local/drawer/documents.vue";
import ChatDrawer from "@/components/local/drawer/chat.vue"
import useAuth from "@/stores";

const auth = useAuth();

const cancelAppRef = ref();
const applyRef = ref();
const documentsRef = ref();
const route = useRoute();
const { isLoading, changeDeclarationStatus, formatType } = useDeclarations();

const data = ref({});
const EReason = {
  DOCISNOTVALID: 1,
  IMGISNOTVALID: 2,
  NOTRESPONSE: 3,
  OTHER: 4,
};
const LOptions = [
  {
    value: 1,
    label: "Bitta dokument",
  },
];
const optionId = ref();
const LReason = [
  {
    label: "Ҳужжат тўлиқ тақдим этилмаган",
    value: EReason.DOCISNOTVALID,
  },
  {
    label: "Сурат яхши эмас",
    value: EReason.IMGISNOTVALID,
  },
  {
    label: "Мурожаатчи жавоб бермаяпти",
    value: EReason.NOTRESPONSE,
  },
  {
    label: "Бошқа",
    value: EReason.OTHER,
  },
];

const form = reactive({
  reason: [],
  other: "",
});
// rasmni yuklash uchun bu qismi o'chirib yuboriladi
const file = ref(null);
const preview = ref(null);
const declType = ref(0);

async function changeStatus() {
  await changeDeclarationStatus(
    route.params.id,
    3,
    "Murojaat rasmiylashtirildi"
  );
  applyRef.value.closeModal();
  optionId.value = undefined;
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
              <a @click="documentsRef.fetchData('passports')" class="docs-links__item">Пасспортлар</a>
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
        <Button class="form-action__btn _1" color="#EA5455" @click="cancelAppRef?.openModal">Қайтариш</Button>
        <Button class="form-action__btn _2" @click="applyRef?.openModal()">Расмийлаштириш</Button>
      </ACol>
    </ARow>
  </Card>
  <pre>{{ data.id }}</pre>
  <ChatDrawer :senderId="auth.user.id" :receiverId="data.id"/>


  <Modal title="Диққат" ref="cancelAppRef">
    <AForm layout="vertical">
      <AFormItem label="Ушбу мурожаатни нима сабабдан қайтармоқчисиз?">
        <ACheckboxGroup class="flex-column" v-model:value="form.reason" :options="LReason" />
      </AFormItem>
      <AFormItem label="Boshqa sabab" v-if="form.reason.includes(EReason.OTHER)">
        <ATextarea placeholder="Kiriting" v-model:value="form.other"></ATextarea>
      </AFormItem>
    </AForm>
  </Modal>
  <Modal @on-submit="changeStatus" ref="applyRef" title="Rasmiylashtirish" :width="400">
    <AForm layout="vertical">
      <AFormItem label="Xujjatlar soni">
        <Select ref="select" v-model:value="optionId" :options="LOptions" />
      </AFormItem>
    </AForm>
  </Modal>
  <DocumentsDrawer :documents="data.documents || []" ref="documentsRef" />
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
</style>
