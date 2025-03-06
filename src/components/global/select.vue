<script setup>
import { Select } from 'ant-design-vue';
import { ref } from 'vue';

const props = defineProps({
    options: {
        type: Array,
        default: () => []
    },
    placeholder: {
        type: String,
        default: "Танланг"
    },
    defaultValue: {
        type: [String, Number],
        default: undefined
    }
});


const emit = defineEmits(['change', 'update:value']);
const selectedValue = ref(props.defaultValue)

const handleChange = (value) => {
    emit('change', value);
    emit('update:value', value);
}

</script>


<template>
    <Select  style="width: 150px" :dropdown-style="{ width: '150px' }" :dropdown-match-select-width="false" v-model:value="selectedValue"
        :options="options" :placeholder="placeholder" @change="handleChange" />
</template>

<style></style>