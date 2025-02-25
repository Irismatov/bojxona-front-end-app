<script setup></script>
<template>
  <header class="header">
    <div class="header-buttons">
      <button class="header-notification">
        <Icon name="notification" />
      </button>
      <button class="header-user">
        <img src="/images/avatar.png" alt="avatar" />
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.header {
  height: var(--height-header);
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-radius: 6px;
  background: white;
  box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.3);

  &-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-left: auto;
  }

  &-notification {
    @include btn-clean;
    .icon {
      --icon-size: 26px;
      --icon-color: #4B465C;
    }
  }


  &-user {
    @include btn-clean;
    width: 38px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: rgba(115, 103, 240, 1);
    overflow: hidden;
  }
}
</style>
