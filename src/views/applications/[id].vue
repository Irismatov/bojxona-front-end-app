<script setup>
import { ref, onMounted, onBeforeMount, computed, reactive, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import { useModal, useDeclarations } from "@/utils/composable";
import axios from "@/plugins/axios";
import DocumentsDrawer from "@/components/local/drawer/documents.vue";
import ChatDrawer from "@/components/local/drawer/chat.vue"
import { useAuth } from "@/stores";

const data = ref({});
const auth = useAuth();

const cancelAppRef = ref();
const applyRef = ref();
const documentsRef = ref();
const route = useRoute();
const { isLoading, changeDeclarationStatus, formatType } = useDeclarations();


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
  const response = await axios.get(`/declarations/${route.params.id}`);
  if (response.data.resultCode === 0) {
    data.value = response.data;
  } else {
    message.error("Xatolik yuz berdi");
  }
}

onMounted(() => {
  fetchData();
});

</script>

<template>
  <Card title="Маълумотлар">
    <ARow :gutter="[12, 24]">
      <ACol span="6">
        <Info label="Мурожаат тури" :value="formatType(data.declType) || '-'" />
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
            <div class="docs-links" style="display: flex; flex-direction: column;">
              <a @click="documentsRef.fetchData('passports')" class="docs-links__item">Пасспортлар</a>
              <a @click="documentsRef.fetchData('tech')" class="docs-links__item">Техпаспортлар</a>
              <template v-if="data.declType === 1">
                <a @click="documentsRef.fetchData('licence')" class="docs-links__item">Юк ташиш рухсатномаси</a>
                <a @click="documentsRef.fetchData('cmr')" class="docs-links__item">CMR ҳужжати</a>
                <a @click="documentsRef.fetchData('invoice')" class="docs-links__item">Инвойс ҳужжатлар</a>
                <a @click="documentsRef.fetchData('unauthorized')" class="docs-links__item">Нотариф ҳужжатлар</a>
                <a @click="documentsRef.fetchData('insurance')" class="docs-links__item">Кафолат ҳужжатлар</a>
              </template>
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
  <ChatDrawer :isOpenStart="route.query.chat === 'true'" :newMessageCount="data.newMessageCount || 0"
    :senderId="auth.user.id" :receiverId="route.params.id" />


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
  <DocumentsDrawer :documents="data.docs || []" ref="documentsRef" />
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
</style>
