<script setup>
import { computed, defineAsyncComponent } from "vue";
const props = defineProps({
  name: {
    type: String,
    default: "calendar",
  },
  color: {
    type: String,
    default: undefined,
  },
  size: {
    type: [Number, String],
    default: undefined,
  },
  custom: {
    type: Boolean,
    default: false,
  },
});
const icon = defineAsyncComponent(() =>
  import(`../../assets/svg/${props.name}.svg`)
);
const styles = computed(() => {
  const result = [];
  if(props.color) {
      result.push(`--icon-color: var(--${props.color})`);
  }
  if (props.size) {
    const isNumber = typeof props.size === "number";
    result.push(`--icon-size: ${isNumber ? props.size + "px" : props.size}`);
  }
  return result;
});
</script>
<template>
  <component :is="icon" :class="{ icon: !custom }" :style="styles"></component>
</template>
<style lang="scss" scoped>
.icon {
  width: var(--icon-size, 24px);
  min-width: var(--icon-size, 24px);
  max-width: var(--icon-size, 24px);
  flex: 0 0 var(--icon-size, 24px);
  fill: var(--icon-color, var(--black-1));
  display: block;
}
</style>
