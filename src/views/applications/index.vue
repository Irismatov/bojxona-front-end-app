<script setup>
import { Table, message } from "ant-design-vue";
import { useModal } from "@/utils/composable/modal.js";
import { ref } from "vue";
import axios from "@/plugins/axios";

const { open, closeModal, openModal } = useModal();
const currentItem = ref();


async function requestToChangeStatus() {
  message.success("Ushbu murojaat sizga yuklab olindi");
  closeModal();
}

const tabs = [
  {
    value: "all",
    label: "Барчаси"
  },
  {
    value: "imei",
    label: "IMEI"
  },
  {
    value: "at",
    label: "АТ"
  },
  {
    value: "mb",
    label: "МБ"
  }
];


const activeTab = ref('all');


const columns = [
  {
    title: "№",
    customRender: ({ index }) => {
      return index + 1;
    },
  },
  {
    title: "Тури",
    dataIndex: "type",
  },
  {
    title: "Рақами",
    dataIndex: "number",
  },
  {
    title: "Жўнатилган вақт",
    dataIndex: "time",
  },
  {
    title: "Почта",
    dataIndex: "email",
  },
  {
    title: "Телефон",
    customRender: ({ record }) => formatUzPhoneNumber(record.phone),
  },
];

const list = [
  {
    id: 1,
    type: "IMEI",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 2,
    type: "AT",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "MB",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "MB",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "AT",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {

    id: 3,
    type: "IMEI",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },

  {
    id: 3,
    key: "1",
    type: "MB",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "AT",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    key: "1",
    type: "IMEI",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "MB",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "AT",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "IMEI",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "MB",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "AT",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    id: 3,
    type: "IMEI",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    type: "MB",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    type: "AT",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
  {
    type: "IMEI",
    number: 202501019557,
    time: "01.02.2025 09:55",
    email: "abdullaev@mail.com",
    phone: "971234567",
  },
];

const customRow = (record) => {
  return {
    onClick: () => {
      currentItem.value = record.id;
      openModal();
    },
    style: {
      cursor: 'pointer',
    }
  }
}

function formatUzPhoneNumber(phone) {
  // Faqat raqamlarni qoldiramiz
  phone = phone.replace(/\D/g, "");

  // Uzbekistan kodi bilan tekshiramiz va qo'shamiz
  if (phone.startsWith("998")) {
    phone = "+" + phone;
  } else if (phone.length === 9) {
    phone = "+998" + phone;
  }

  // Formati: +998 (XX) XXX XX XX
  return phone.replace(
    /^(\+998)(\d{2})(\d{3})(\d{2})(\d{2})$/,
    "$1 ($2) $3 $4 $5"
  );
}
</script>
<template>

  <Tab :list="tabs" v-model="activeTab" />


  <Table :data-source="list" :columns="columns" :custom-row="customRow">

  </Table>
  <Modal :open="open" @cancel="closeModal" title="Диққат"
    subtitle="Мазкур мурожаатни қайта ишлашга ўзингизга юклаб олишга розимисиз?">
    <div class="warning">
      <div class="warning-action">
        <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF" @click="closeModal">ЙЎҚ</Button>
        <Button @click="requestToChangeStatus()">ҲА</Button>
      </div>
    </div>
  </Modal>
</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.warning {
  display: flex;
  flex-direction: column;

  &-action {
    align-self: flex-end;
    display: flex;
    gap: 16px;
  }




}
</style>