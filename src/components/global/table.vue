<script setup>
import { Table } from 'ant-design-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});


</script>

<template>
    <div>
        <Table :columns="props.data.columns" :data-source="props.data.list" :pagination="false">
            <!-- Custom cell rendering for the Action column -->
            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'index'">
                    <span>{{ index + 1 }} </span>
                </template>
                <template v-if="column.key === 'action'">
                    <button class="ant-table__btn" @click="$router.push(`applications/${index}`)">
                        <Icon name="download-2" />
                    </button>
                </template>
            </template>
        </Table>
    </div>
</template>

<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.ant {
    &-table {
        &-thead {
            &>tr {
                &>th {
                    background-color: #DBDADE !important;
                    padding: 16px 20px;
                    color: #4B465C;
                    font-feature-settings: 'liga' off, 'clig' off;
                    font-family: "Public Sans";
                    font-size: 13px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: normal;
                    letter-spacing: 1px;
                    text-transform: uppercase;

                    &::before {
                        display: none;
                    }

                    &:last-child {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
            }
        }

        &-tbody {
            &>tr {
                &>td {
                    color: #4B465C;
                    font-feature-settings: 'liga' off, 'clig' off;
                    font-family: "Public Sans";
                    font-size: 15px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 22px;

                    border-bottom: 1px solid #DBDADE !important;

                    &:first-child {
                        border-left: 1px solid #DBDADE;
                    }

                    &:last-child {
                        border-right: 1px solid #DBDADE;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                }


            }



        }

        &__btn {
            @include btn-clean;
            

            .icon {
                --icon-size: 40px;
                --icon-color: #7367f0;
            }
        }
    }
}
</style>