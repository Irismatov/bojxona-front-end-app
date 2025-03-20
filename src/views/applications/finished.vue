<script setup>
import { Table } from "ant-design-vue";
import { useDeclarations } from "@/utils/composable";
import { ref, onMounted, reactive } from "vue";
import ActionBtn from "@/components/local/button/action.vue";
import { formatTimestamp } from "@/utils/mixins"
import { useAuth } from "@/stores"


const auth = useAuth();
const { list, totalElements, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();

const currentItem = ref();
const modalRef = ref();

async function fetchData() {
    await getDeclarations(4, activeTab.value, {
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

const columnsDeclarant = [
    {
        title: "№",
        customRender: ({ index }) => {
            return index + 1;
        }
    },
    {
        title: "Тури",
        customRender: ({ record }) => formatType(record.declType),
    },
    {
        title: "Рақами",
        dataIndex: "number",
    },
    {
        title: "Жўнатилган вақт",
        customRender: ({ record }) => formatTimestamp(record.createdAt),
    },
    {
        title: "Қабул вақти",
        customRender: ({ record }) => formatTimestamp(record.receivedAt),
    },
    {
        title: "Тугатилган вақти",
        customRender: ({ record }) => formatTimestamp(record.finishedAt),
    },
    {
        title: "Туланган сумма",
        dataIndex: "paidAmount"
    },
    {
        key: "action",
    },
];

const columnsAdmin = [
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
        customRender: ({ record }) => formatTimestamp(record.createdAt),
    },
    {
        title: "Қабул вақти",
        customRender: ({ record }) => formatTimestamp(record.receivedAt),
    },
    {
        title: "Тугатилган вақти",
        customRender: ({ record }) => formatTimestamp(record.finishedAt),
    },
    {
        title: "Туланган сумма",
        dataIndex: "paidAmount"
    },
    {
        title: "Декларант",
        customRender: ({ record }) => record.declarant?.pinfl
    }
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

    <Table :pagination="false" :data-source="list" :columns="auth.user.roleId === 2 ? columnsDeclarant : columnsAdmin">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
                <div style="display: flex; gap: 8px;">
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