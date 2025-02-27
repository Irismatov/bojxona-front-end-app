<script setup>
import { Table } from "ant-design-vue";
import {useModal} from "@/utils/composable/modal.js"

const {openModal, closeModal, open} = useModal();


const columns = [
    {
        title: "№",
        customRender: ({ index }) => {
            return index + 1;
        },
    },
    {
        title: "FIO",
        dataIndex: "fio",
    },
    {
        title: "Turi",
        dataIndex: "type",
    },
    {
        title: "Telefon",
        dataIndex: "phone",
    },
    {
        title: "Yashash manzil",
        dataIndex: "address"
    },
    {
        title: "Boshqarish",
        key: "action",
    },
];

const list = [
    {
        fio: "Ali Aliyev",
        type: "DEKLARANT",
        phone: "+32423442342",
        address: "O'rikzor 4"
    },
    {
        fio: "Ali Aliyev",
        type: "DEKLARANT",
        phone: "+32423442342",
        address: "O'rikzor 4"
    },
    {
        fio: "Ali Aliyev",
        type: "DEKLARANT",
        phone: "+32423442342",
        address: "O'rikzor 4"
    },
    {
        fio: "Ali Aliyev",
        type: "DEKLARANT",
        phone: "+32423442342",
        address: "O'rikzor 4"
    },
    {
        fio: "Ali Aliyev",
        type: "DEKLARANT",
        phone: "+32423442342",
        address: "O'rikzor 4"
    }
]

</script>
<template>
    <div class="card">
        <div class="card-header">
            <h1 class="card-header__title">Hodimlar</h1>
            <button class="card-header__btn" @click="openModal">+ Yangi hodim yaratish </button>
        </div>
        <div class="card-body">
            <Table :columns="columns" :data-source="list">
                <template #bodyCell="{ column }">
                    <template v-if="column.key === 'action'">
                        <div class="action">
                            <RouterLink :to="`/applications/detail/1`">
                                <Button class="action-link__btn _2">
                                    Tahrirlash
                                </Button>
                            </RouterLink>
                        </div>
                    </template>
                </template>
            </Table>
        </div>
    </div>


    <Modal :open="open" @cancel="closeModal" title="Yangi hodim" subtitle="Yangi hodimning ma'lumotlarini kiriting">
    </Modal>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.card {
    background-color: #FFF;
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0px 4px 18px 0px rgba(75, 70, 92, 0.10);
    overflow: hidden;
    padding: 24px;

    &-header {
        margin-bottom: 24px;

        &__title {
            color: #4B465C;
            font-feature-settings: 'liga' off, 'clig' off;
            font-family: "Public Sans";
            font-size: 18px;
            font-style: normal;
            font-weight: 600;
            line-height: 24px;
            margin-bottom: 24px;
        }

        &__btn {
            @include btn-clean;
            border-radius: 6px;
            background: #7367F0;
            box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.30);
            height: 38px;
            padding: 0 20px;
            color: #FFF;
            font-feature-settings: 'liga' off, 'clig' off;
            font-family: "Public Sans";
            font-size: 15px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: 0.43px;
            transition: all 0.2s ease-in-out;

            &:hover {
                background-color: #FFF;
                color: #7367F0;
            }
        }
    }


}
</style>