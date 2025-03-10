<script setup>
import { Modal } from "ant-design-vue";
import { computed, ref } from "vue";
const modalRef = ref();
const emits = defineEmits(["onSubmit"]);
const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  subtitle: {
    type: String,
    default: undefined,
  },
  height: {
    type: Number,
    default: undefined,
  },
});

const open = ref(false);

function toggleModal(value) {
  open.value = value;
}

function openModal() {
  open.value = true;
}

function closeModal() {
  open.value = false;
}

const styles = computed(() => {
  const result = [];
  result.push(`--local-height: ${props.height}px`);
});

defineExpose({ open, toggleModal, openModal, closeModal, modalRef });
</script>
<template>
  <Modal wrap-class-name="modal" :footer="false" :style="styles" :open="open" @cancel="closeModal" :force-render="true"
    ref="modalRef">
    <div class="modal-header">
      <h2 class="modal-header__title">
        {{ title }}
      </h2>
      <h3 class="modal-header__subtitle" v-if="subtitle">
        {{ subtitle }}
      </h3>
      <button class="modal-header__close" @click="closeModal">
        <Icon name="close" />
      </button>
    </div>
    <div class="modal-body">
      <slot></slot>
    </div>
    <div class="modal-footer">
      <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF" @click="closeModal">Bekor
        qilish</Button>
      <Button color="#7367F0" @click="emits('onSubmit')">Saqlash</Button>
    </div>
  </Modal>
</template>
<style lang="scss">
@use "@/assets/scss/config/mixins" as *;

.modal {
  &-header {
    &__title {
      color: #4b465c;
      font-feature-settings: "liga" off, "clig" off;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
    }

    &__subtitle {
      color: #4b465c;
      font-feature-settings: "liga" off, "clig" off;
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      margin-top: 8px;
    }

    &__close {
      @include btn-clean;
      position: absolute;
      right: 16px;
      top: 16px;
      opacity: 0.8;

      .icon {
        --icon-color: var(--body-text);
      }
    }
  }

  &-body {
    padding: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    row-gap: 16px;
  }

  &-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  .ant {
    &-modal {
      &-header {
        display: none !important;
      }

      &-content {
        padding: 16px;
      }

      &-close {
        display: none !important;
      }
    }
  }
}
</style>
