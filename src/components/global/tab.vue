<script setup>
import { computed } from "vue";
const props = defineProps({
    list: {
        type: Array,
        default: [],
    },
    modelValue: {
        type: [String, Number, Boolean], // Adjust based on the type of your tab values
        default: "",
    },
    valueKey: {
        type: String,
        default: "value",
    },
    labelKey: {
        type: String,
        default: "label",
    },
    isFilled: {
        type: Boolean,
        default: false,
    },
    allowClear: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(["update:modelValue", "change"]);
const classes = computed(() => {
    const result = [];
    if (props.isFilled) {
        result.push("tab-filled");
    }
    return result;
});
const handleClick = (value) => {
    if (value === props.modelValue) {
        if (props.allowClear) {
            emit("update:modelValue", undefined);
            emit("change", undefined);
        }
    } else {
        emit("update:modelValue", value);
        emit("change", value);
    }
};

</script>

<template>
    <div class="tab" :class="classes">
        <button class="tab-item" v-for="item in list" :key="item[props.valueKey]"
            :class="{ 'tab-item-active': item[props.valueKey] === props.modelValue }"
            @click="handleClick(item[props.valueKey])" type="button">
            <slot name="leftSide" v-bind="{ item }"></slot>
            {{ item[props.labelKey] }}
            <slot name="rightSide" v-bind="{ item }"></slot>
        </button>
    </div>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.tab {
    display: flex;
    align-items: center;
    padding: 4px;
    gap: 4px;
    border-radius: 8px;
    background: #FFF;

    &-item {
        padding: 0 12px;
        height: 38px;
        background-color: transparent;
        border: none;
        min-width: 120px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: #4B465C;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "Public Sans";
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;

        &-active {
            color: #FFF;
            background: #7367F0;
            box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.30);
        }
    }

    &-filled {
        width: 100%;

        .tab-item {
            min-width: unset;
            flex: 1;
        }
    }
}
</style>
