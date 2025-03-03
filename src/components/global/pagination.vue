<script setup>
import { Pagination } from 'ant-design-vue';

const props = defineProps({
    pagination: {
        type: Object,
        default: {}
    },
    fetchData: {
        type: Function,
        required: true
    }
});

function onChange() {
    props.fetchData();
}

</script>


<template>
    <Pagination class="pagination" v-model:current="pagination.page" :page-size="pagination.size || 10"
        :total="pagination.total || 0" :showSizeChanger="false" @change="onChange">
        <template #itemRender="{ type, page }">
            <span v-if="type === 'page'">{{ page }}</span>
            <span v-else-if="type === 'prev'">Oldingi</span>
            <span v-else-if="type === 'next'">Keyingi</span>
        </template>
    </Pagination>
</template>


<style lang="scss" scoped></style>