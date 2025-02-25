<script setup>
defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <RouterLink
    class="card"
    :to="`/applications/${data.path}`"
    :style="`--local-color: ${data.color}`"
  >
    <div class="card-icon">
      <Icon :name="data.icon" />
    </div>
    <div class="card-info">
      <span class="card-info__title">
        {{ data.count }}
      </span>
      <span class="card-info__count">
        {{ data.title }}
      </span>
    </div>
  </RouterLink>
</template>
<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
.card {
  display: flex;
  align-items: center;
  border-radius: 6px;
  background: #fff;
  /* Light/Gray/Card */
  box-shadow: 0px 4px 18px 0px rgba(75, 70, 92, 0.1);
  padding: 24px;
  gap: 16px;

  &.router-link-exact-active {
    background-color: rgb(var(--local-color));
    --local-active-color: white;
    --local-active-bg-color: rgba(255, 255, 255, 0.15);
    --local-active-icon-color: white;
  }

  &-info {
    display: flex;
    flex-direction: column;
    justify-content: start;
    margin-right: auto;
    height: 100%;

    &__title {
      color: var(--local-active-color, #4b465c);
      font-feature-settings: "liga" off, "clig" off;
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      margin-bottom: 4px;
    }

    &__count {
      color: var(--local-active-color, #4b465c);
      font-feature-settings: "liga" off, "clig" off;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
  }

  &-icon {
    background-color: var(
      --local-active-bg-color,
      rgba(var(--local-color), 0.1)
    );
    width: 42px;
    aspect-ratio: 1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      --icon-color: var(--local-active-icon-color, rgb(var(--local-color)));
      --icon-size: 24px;
    }
  }
}
</style>
