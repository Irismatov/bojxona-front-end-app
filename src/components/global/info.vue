<script setup>
import { computed } from "vue";
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    default: undefined,
  },
  colorValue: {
    type: String,
    default: "#4b465c",
  },
  colorLabel: {
    type: String,
    default: "#4b465c",
  },
});
const styles = computed(() => {
  const result = [];
  if (props.colorValue) {
    result.push(`--local-value-color: ${props.colorValue}`);
  }
  if (props.colorLabel) {
    result.push(`--local-label-color: ${props.colorLabel}`);
  }
  return result;
});
</script>
<template>
  <div class="info" :style="styles">
    <span class="info-label"> {{ label }}: </span>
    <span class="info-value">
      <template v-if="!$slots.value">
        {{ value || '-' }}
      </template>
      <slot name="value"></slot>
    </span>
  </div>
</template>
<style lang="scss" scoped>
.info {
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  &-label {
    color: var(--local-label-color);
    font-feature-settings: "liga" off, "clig" off;
    font-size: 15px;
    font-weight: 600;
    line-height: 22px;
  }
  &-value {
    color: var(--local-value-color);
    font-feature-settings: "liga" off, "clig" off;
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    * {
      color: var(--local-value-color);
    }
  }
}
</style>
