<script setup>
defineProps({
  title: {
    type: String,
    default: undefined,
  },
});
</script>
<template>
  <div class="card">
    <div class="card-header" v-if="title">
      <h2 class="card-header__title">
        {{ title }}
      </h2>
    </div>
    <div class="card-body" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 8px;
  background-color: var(--white-1);
  overflow: hidden;
  box-shadow: 0px 4px 18px 0px rgba(75, 70, 92, 0.1);
  &-header {
    background: rgb(251,251,252);
    padding: 12px;
    display: flex;
    align-items: center;
    &__title {
      margin-right: auto;
      color: #4b465c;
      font-feature-settings: "liga" off, "clig" off;
      font-family: "Public Sans";
      font-size: 22px;
      font-style: normal;
      font-weight: 600;
      line-height: 30px; 
    }
  }
  &-body {
    padding: 18px;
  }
}
</style>
