<script setup>
import { Table } from "ant-design-vue";
import { useModal, useDeclarations, useDeclStatusChange } from "@/utils/composable";
import { ref, onMounted, reactive, onUnmounted } from "vue";

const declStatusChange = useDeclStatusChange();
const { open, closeModal, openModal } = useModal();
const currentItem = ref();
const { list, totalElements, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();
const modalRef = ref();



async function requestToChangeStatus() {
  await changeDeclarationStatus(currentItem.value, 2, "Ushbu murojaat sizga yuklandi");
  modalRef.value.closeModal();
  fetchData();
}

const pagination = reactive(
  {
    page: 1,
    total: totalElements,
  }
);


async function fetchData() {
  await getDeclarations(1, activeTab.value, {
    page: pagination.page - 1,
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
  pagination.page = 1;
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
      modalRef.value.openModal()
    },
    style: {
      cursor: 'pointer',
    }
  }
}

onMounted(() => {
  fetchData();
  declStatusChange.connect();
  declStatusChange.on('change', fetchData);
});

onUnmounted(() => {
  declStatusChange.disconnect();
})

</script>
<template>

  <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />


  <Table :data-source="list" :columns="columns" :custom-row="customRow" :pagination="false">

  </Table>

  <Pagination v-if="totalElements > 0" :pagination="pagination" :fetchData="fetchData" />

  <Modal @on-submit="requestToChangeStatus" ref="modalRef" title="Диққат" subtitle="Мазкур мурожаатни қайта ишлашга ўзингизга юклаб олишга розимисиз?">
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