<script setup>
import { Pagination } from "ant-design-vue";
const props = defineProps({
    pagination: {
        type: Object,
        default: {}
    },
    fetchData: {
        type: Function,
        required: true
    }
})
function onChange() {
    props.fetchData()
}
</script>
<template>
    <Pagination class="pagination" v-model:current="pagination.page" :page-size="pagination.per_page || 10"
        :total="pagination.total || 0" :showSizeChanger="false" @change="onChange" >
        <template #itemRender="{ type, page }">
            <button class="pagination-item">
                <Icon :name="`angle-${type}`" v-if="['prev', 'next', 'jump-prev', 'jump-next'].includes(type)" />
                <template v-else>{{ page }}</template>
            </button>
        </template>
    </Pagination>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.pagination {
    --pagination-height: 40px;
    --pagination-bg: rgba(75, 70, 92, 0.08);
    --pagination-color: #4B465C;
    --pagination-active-bg: #7367F0;
    --pagination-active-color: var(--white-1);
    --pagination-hover-bg: rgba(75, 70, 92, 0.16);
    --pagination-hover-color: #FFF;
    display: flex;
    justify-content: center;

    .ant-pagination {

        &-jump-next,
        &-jump-prev,
        &-item,
        &-prev,
        &-next {
            height: auto;
            min-height: auto;
            width: auto;
            border: none;
        }

        &-item {
            &-active {
                border: none;
            }
        }

        &-jump-next,
        &-jump-prev,
        &-prev,
        &-next {
            .pagination-item {
                --icon-color: var(--pagination-color);
                background-color: var(--pagination-bg);
                color: var(--pagination-color);

                &:hover {
                    --icon-color: var(--pagination-hover-color);
                    background-color: var(--pagination-hover-bg);
                    color: var(--pagination-hover-color);
                }
            }
        }

    }

    &-item {
        background-color: transparent;
        border: none;
        height: var(--pagination-height);
        aspect-ratio: 1/1;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--pagination-bg);
        cursor: pointer;
        border-radius: 8px;
        // @include body-1(var(--pagination-color));

        .ant-pagination-item-active & {
            background-color: var(--pagination-active-bg);
            color: var(--pagination-active-color);
        }

        &:hover {
            background-color: var(--pagination-hover-bg);
            color: var(--pagination-hover-color);
        }
    }
}
</style>
