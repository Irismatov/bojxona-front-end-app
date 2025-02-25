<script setup>
import { Table } from "ant-design-vue";
import { useModal } from "@/utils/composable/modal.js";

const { open, closeModal, openModal } = useModal();


const columns = [
  {
    title: "№",
    customRender: ({ index }) => {
      return index + 1;
    },
  },
  {
    title: "Turi",
    dataIndex: "type",
  },
  {
    title: "Raqami",
    dataIndex: "number",
  },
  {
    title: "Jo'natilgan vaqt",
    dataIndex: "time",
  },
  {
    title: "Pochta",
    dataIndex: "email",
  },
  {
    title: "Telefon",
    customRender: ({ record }) => formatUzPhoneNumber(record.phone),
  },

];
const list = [
  {
    type: "IMEI",
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
    type: "MB",
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

  {
    key: "1",
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
    key: "1",
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
  <Table :data-source="list" :columns="columns" :custom-row="customRow">
  </Table>
  <Modal :open="open" @cancel="closeModal" title="Diqqat" subtitle="Mazkur murojaatni qayta ishlashga o'zingizga yuklab olishga rozimisiz?">
    <div class="warning">
      <div class="warning-action">
        <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF">YO'Q</Button>
        <Button>HA</Button>
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