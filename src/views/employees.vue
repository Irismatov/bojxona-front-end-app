<script setup>
import { Table } from "ant-design-vue";
import { useModal } from "@/utils/composable/modal.js"
import { ref, reactive, onMounted } from "vue";
import axios from "@/plugins/axios";

const { openModal, closeModal, open } = useModal();

const columns = [
    {
        title: "№",
        customRender: ({ index }) => {
            return index + 1;
        },
    },
    {
        title: "FIO",
        dataIndex: "fullName",
    },
    {
        title: "Role",
        dataIndex: "role",
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


const list = ref([]);

async function fetchData() {
    const response = await axios.get("/users");
    list.value = response.data;
}


const form = reactive({
    username: "",
    fio: "",
    role: "ADMIN",
    password: "",
    phone: "",
    address: "",
    email: ""
})

const onFinish = async (values) => {
    const response = await axios.post("/users", values);
    console.log(response);
    closeModal();
}

const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
}


onMounted(async () => {
    await fetchData();
});

</script>



<template>
    <div class="card">
        <div class="card-header">
            <h1 class="card-header__title">Hodimlar</h1>
            <button class="card-header__btn" @click="openModal">+ Yangi hodim yaratish </button>
        </div>
        <div class="card-body">
            <Table :columns="columns" :data-source="list" :pagination=false>
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
        <AForm :model="form" layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
            <AFormItem label="FIO" name="fio">
                <AInput v-model:value="form.fio"></AInput>
            </AFormItem>
            <AFormItem label="Username" name="username">
                <AInput v-model:value="form.username"></AInput>
            </AFormItem>
            <AFormItem label="Turi" name="role">
                <ASelect v-model:value="form.role">
                    <ASelectOption value="ADMIN">ADMIN</ASelectOption>
                    <ASelectOption value="MANAGER">MANAGER</ASelectOption>
                    <ASelectOption value="DECLARANT">DEKLARANT</ASelectOption>
                </ASelect>
            </AFormItem>
            <AFormItem label="Parol" name="password">
                <AInput v-model:value="form.password"></AInput>
            </AFormItem>
            <AFormItem label="Phone" name="phone">
                <AInput v-model:value="form.phone"></AInput>
            </AFormItem>
            <AFormItem label="Address" name="address">
                <AInput v-model:value="form.address"></AInput>
            </AFormItem>
            <AFormItem label="Email" name="email">
                <AInput v-model:value="form.email"></AInput>
            </AFormItem>
            <Button>Qo'shish</Button>
        </AForm>
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