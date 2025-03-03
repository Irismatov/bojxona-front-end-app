<script setup>
import { Table } from "ant-design-vue";
import { useModal, useDeclarations } from "@/utils/composable";
import axios from "@/plugins/axios";
import { ref, onMounted, computed, reactive } from "vue";

const { open, closeModal, openModal } = useModal();
const { list, totalElements, isLoading, getDeclarations, changeDeclarationStatus, formatType } = useDeclarations();

const currentItem = ref();

async function fetchData() {
    await getDeclarations(1, activeTab.value, {
        page: pagination.page - 1,
        size: 10
    });
};

async function requestToChangeStatus() {
   await changeDeclarationStatus(currentItem.value, 2, "Ushbu murojaat ortga qaytarildi");
   closeModal();
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
    openModal();
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
    <Pagination v-if="totalElements > 0"  :pagination="pagination" :fetchData="fetchData"/>
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