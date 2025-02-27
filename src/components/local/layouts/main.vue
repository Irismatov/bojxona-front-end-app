<script setup>
import Aside from '../aside.vue';
import Header from '../header.vue';


</script>


<template>
    <div class="layout">
        <Aside />
        <div class="layout-main">
            <Header />
            <div class="layout-main-wrapper">
                <RouterView />
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
.layout {
    display: flex;

    &-main {
        width: calc(100% - var(--width-aside));
        padding: var(--space-16) var(--space-24);
        transition: all 0.3s ease-in-out;
        height: 100vh;
        overflow: hidden;

        &-wrapper {
            margin-top: var(--space-16);
            height: calc(100vh - var(--height-header) - (var(--space-16) * 3));
            overflow-y: auto;
            overflow-x: hidden;

            &>*:not(:last-child) {
                margin-bottom: var(--space-16);
            }
        }
    }
}
</style>