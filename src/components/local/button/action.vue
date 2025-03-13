<script setup>
import { computed } from 'vue';


const props = defineProps({
    icon: {
        type: String,
        default: 'mail'
    },
    color: {
        type: String,
        default: 'default'
    },
    isActive: {
        type: Boolean,
        default: true
    }
});


const colorPallete = {
    default: {
        bg: 'rgba(115, 103, 240, 0.24)',
        bgHover: '#7367F0',
        iconColor: '#7367F0',
        iconHoverColor: '#FFF',
    },
    red: {
        bg: 'rgba(234, 84, 85, 0.24)',
        bgHover: '#EA5455',
        iconColor: '#EA5455',
        iconHoverColor: '#FFF'
    }
}


const styles = computed(() => {
    const result = [];
    const colors = colorPallete[props.color];
    result.push(`--local-bg: ${colors.bg}`);
    result.push(`--local-bg-hover: ${colors.bgHover}`);
    result.push(`--local-icon-color: ${colors.iconColor}`);
    result.push(`--local-icon-hover-color: ${colors.iconHoverColor}`);
    return result;
})
</script>


<template>
    <button class="button" :style="styles" :class="{ 'inactive': !isActive }"
        :disabled="!isActive">
        <Icon :name="icon" />
    </button>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.button {
    @include btn-clean;
    border-radius: 8px;
    background-color: var(--local-bg);
    height: 38px;
    padding: 0 18px;
    transition: all 0.2s ease-in-out;

    .icon {
        --icon-color: var(--local-icon-color);
        --icon-size: 20px;
    }

    &:hover {
        background-color: var(--local-bg-hover);

        .icon {
            --icon-color: var(--local-icon-hover-color);
        }
    }

    &.inactive {
        background-color: rgba(168, 170, 174, 0.24);

        .icon {
            --icon-color: #A8AAAE;
        }
    }
}
</style>