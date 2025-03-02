<script setup>
import { Table, message } from "ant-design-vue";
import { useModal, useDeclarations } from "@/utils/composable";
import { ref, onMounted } from "vue";
import axios from "@/plugins/axios";

const { open, closeModal, openModal } = useModal();
const currentItem = ref();
const { list, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();


async function requestToChangeStatus() {
  await changeDeclarationStatus(currentItem.value, 2, "Ushbu murojaat sizga yuklandi");
  closeModal();
  fetchData();
}


async function fetchData() {
  await getDeclarations(1, activeTab.value , {
    page: 0,
    size: 10
  });
}


const tabs = [
  {
    value: -1,
    label: "Барчаси"
  },
  {
    value: "0",
    label: "МБ"
  },
  {
    value: "1",
    label: "АТ"
  },
  {
    value: "2",
    label: "ИМЕИ"
  }
];

const activeTab = ref(-1);

const handleTabChange = (value) => {
  activeTab.value = value;
  console.log(activeTab.value);
  fetchData();
};

const columns = [
  {
    title: "№",
    customRender: ({ index }) => {
      return index + 1;
    },
  },
  {
    title: "Тури",
    customRender: ({ record }) => formatType(record.type),
  },
  {
    title: "Рақами",
    dataIndex: "declNumber",
  },
  {
    title: "Жўнатилган вақт",
    customRender: ({ record }) => formatTimestamp(record.createdAt)
  },
  {
    title: "Почта",
    customRender: ({ record }) => {
      if (record.email != null) {
        return record.email;
      } else {
        return '-'
      }
    }
  },
  {
    title: "Телефон",
    customRender: ({ record }) => {
      if (record.phone != null) {
        return record.phone;
      } else {
        return '-'
      }
    }
  },
];

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000); // UNIX timestamp sekund formatida keladi

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy 0 dan boshlanadi
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} --- ${hours}:${minutes}`;
}

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

onMounted(() => {
  fetchData();
});

</script>
<template>

  <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />


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