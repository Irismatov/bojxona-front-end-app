<script setup>
import { Modal } from "ant-design-vue";
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: undefined
  }
});


</script>
<template>
  <Modal wrap-class-name="modal" :footer="false">
    <template #title v-if="props.title">
      {{ props.title }}
    </template>
    <slot></slot>
  </Modal>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.modal {
  .ant-modal {
    &-close {}

    &-content {}

    &-header {}

    &-title {
      margin-bottom: 20px;
      color: #4B465C;
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: "Public Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
    }
  }
}
</style>
