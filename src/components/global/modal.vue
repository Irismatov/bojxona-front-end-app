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
      <h1 class="modal-title">{{ props.title }}</h1>
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
}

::v-deep(.modal) {
  .ant {
    &-modal {


      &-content {
        padding: 10px 12px;
      }
    }
  }
}
</style>
