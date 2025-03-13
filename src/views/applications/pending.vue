<script setup>
import { Table, message } from "ant-design-vue";
import { useDeclarations } from "@/utils/composable";
import { ref, onMounted, computed, reactive } from "vue";
import ActionBtn from "@/components/local/button/action.vue";


const { list, totalElements, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();

const modalRef = ref();
const currentItem = ref();

async function requestToChangeStatus() {
    await changeDeclarationStatus(currentItem.value, 2, "Murojaat jarayonda holatiga o'zgartirildi");
    fetchData()
    modalRef.value.closeModal();
}


async function fetchData() {
    await getDeclarations(3, activeTab.value, {
        page: pagination.page - 1,
        size: 10
    });
}

const pagination = reactive({
    page: 1,
    total: totalElements
});

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
        customRender: ({ record }) => formatTimestamp(record.createdAt)
    },
    {
        title: "Қабул вақти",
        customRender: ({ record }) => formatTimestamp(record.receivedAt)
    },
    {
        title: "Тугатилган вақти",
        dataIndex: "finishedAt",
    },
    {
        title: "Тулов суммаси",
        dataIndex: "totalAmount"
    },
    {
        title: "Туланган йигим",
        dataIndex: "paidAmount"
    },
    {
        title: "Муносабат",
        key: "action",
    },
];


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

const onClickTableButton = (value) => {
    currentItem.value = value;
    modalRef.value.openModal();
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
                    <ATooltip>
                        <template #title>
                            <span> Мурожаатни жараён ҳолатига қайтариш</span>
                        </template>
                        <ActionBtn icon="return" @click="onClickTableButton(record.id)" />
                    </ATooltip>
                </div>
            </template>
        </template>
    </Table>
    <Pagination v-if="totalElements > 0" :pagination="pagination" :fetchData="fetchData" />

    <Modal ref="modalRef" @on-submit="requestToChangeStatus" title="Диққат"
        subtitle="Мазкур мурожаатни ортга кайтармохчимисиз?">
    </Modal>
</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
</style>