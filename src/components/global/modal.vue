<script setup>
import { Modal } from "ant-design-vue";
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  subtitle: {
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
    <p class="modal-subtitle" v-if="props.subtitle">
      {{ props.subtitle }}
    </p> 
    <slot></slot>
  </Modal>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.modal {
  &-subtitle {
    color: #4B465C;
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: "Public Sans";
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 16px;
  }

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
