<script setup>
import { Table } from "ant-design-vue";
import { useModal } from "@/utils/composable";
import axios from "@/plugins/axios";
import { ref, onMounted, computed } from "vue";
import { useDeclarations } from "@/utils/composable"

const { open, closeModal, openModal } = useModal();
const { list, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();

const currentItem = ref();

async function fetchData() {
    await getDeclarations(1, activeTab.value);
};

async function requestToChangeStatus() {
   await changeDeclarationStatus(currentItem.value, 2, "Ushbu murojaat sizga yuklandi");
   closeModal();
   fetchData();
}


const columns = [
    {
        title: "№",
        customRender: ({ index }) => {
            return index + 1;
        }
    },
    {
        title: "Тури",
        customRender: ({ record }) => formatType(record.type),
    },
    {
        title: "Рақами",
        dataIndex: "number",
    },
    {
        title: "Жўнатилган вақт",
        dataIndex: "createdAt",
    },
    {
        title: "Қабул вақти",
        dataIndex: "startedAt",
    },
    {
        title: "Тугатилган вақти",
        dataIndex: "finishedAt",
    },
    {
        title: "Муносабат",
        key: "action",
    },
];






const tabs = [
    {
        value: null,
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

const activeTab = ref(null);

const handleTabChange = (value) => {
    activeTab.value = value;
    console.log(activeTab.value);
    fetchData();
};

const onClickTableButton = (value) => {
    currentItem.value = value;
    openModal();
}

onMounted(() => {
    fetchData();
});

function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // UNIX timestamp sekund formatida keladi

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy 0 dan boshlanadi
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} --- ${hours}:${minutes}`;
}
</script>

<template>
    <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />

    <Table :data-source="list" :columns="columns">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <div class="action">
                    <!-- <Button class="action-link__btn _1">
            <Icon name="mail" />
          </Button> -->
                    <Button @click="onClickTableButton(record.id)" class="action-link__btn _2">
                        Кайтариш
                    </Button>
                </div>
            </template>
        </template>
    </Table>
    <Modal :open="open" @cancel="closeModal" title="Диққат" subtitle="Мазкур мурожаатни ортга кайтармохчимисиз?">
        <div class="warning">
            <div class="warning-action">
                <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF"
                    @click="closeModal">ЙЎҚ</Button>
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