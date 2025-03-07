<script setup>
import { computed } from 'vue';


const props = defineProps({
  color: {
    type: String,
    default: "#7367F0"
  },
  bgColor: {
    type: String,
    default: "#FFF"
  },
  borderColor: {
    type: String,
    default: "var(--local-color)"
  },
  isDisabled: {
    type: Boolean,
    default: false
  }
});

const styles = computed(() => {
  const result = [];
  result.push(`--local-color: ${props.color}`);
  result.push(`--local-bg: ${props.bgColor}`)
  result.push(`--local-border-color: ${props.borderColor}`);
  return result;
})
</script>

<template>
  <button class="button" :style="styles" :disabled="props.isDisabled">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.button {
  @include btn-clean;
  border-radius: 8px;
  border: 1px solid var(--local-border-color);
  height: 38px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--local-color);
  font-feature-settings: 'liga' off, 'clig' off;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.43px;
  transition: all 0.2s ease-in-out;
  background-color: var(--local-bg);

  &:hover {
    background-color: var(--local-color);
    color: #ffff;
    border: 1px solid #ffff;
  }
}
</style>