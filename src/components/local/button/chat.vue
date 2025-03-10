<template>
    <button class="button">
        <Icon name="mail" />
        ЧАТ
    </button>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.button {
    position: fixed;
    right: -15px;
    bottom: 50px;
    border-radius: 8px;
    border: 1px solid var(--local-border-color);
    height: 38px;
    padding: 0 30px 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #f1c40f;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    color: #FFF;
    font-size: 16px;
    font-weight: bold;

    .icon {
        --icon-color: #FFF;
    }
}
</style>