<script setup>
import { Table } from "ant-design-vue";
import { useDeclarations } from "@/utils/composable";
import { ref, onMounted, reactive } from "vue";
import ActionBtn from "@/components/local/button/action.vue";

const { list, totalElements, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();

const currentItem = ref();
const modalRef = ref();

async function fetchData() {
    await getDeclarations(1, activeTab.value, {
        page: pagination.page - 1,
        size: 10
    });
};

async function requestToChangeStatus() {
    await changeDeclarationStatus(currentItem.value, 2, "Ushbu murojaat ortga qaytarildi");
    modalRef.value.closeModal();
    fetchData();
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
        title: "Туланган сумма",
        dataIndex: "paidAmount"
    },
    {
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
        label: "Туланган"
    },
    {
        value: "1",
        label: "Кайтарилган"
    },
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

</script>

<template>
    <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />

    <Table :data-source="list" :columns="columns">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <div style="display: flex; gap: 16px;">
                    <RouterLink :to="`/applications/detail/${record.id}`">
                        <ATooltip>
                            <template #title>
                                <span>Мижоздан келган хабар</span>
                            </template>
                            <ActionBtn icon="mail" />
                        </ATooltip>
                    </RouterLink>
                    <ATooltip>
                        <template #title>
                            <span>Мурожаатни жараён ҳолатига қайтариш</span>
                        </template>
                        <ActionBtn @click="onClickTableButton(record.id)" icon="return" />
                    </ATooltip>
                </div>
            </template>
        </template>
    </Table>
    <Pagination v-if="totalElements > 0" :pagination="pagination" :fetchData="fetchData" />
    <Modal ref="modalRef" @on-submit="requestToChangeStatus" title="Диққат"
        subtitle="Мазкур мурожаатни ортга кайтармохчимисиз?" />
</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
</style>