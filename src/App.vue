<script setup>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { onMounted } from "vue";

onMounted(() => {
  Fancybox.bind("[data-fancybox]");
});
</script>
<template>
<component :is="$route.meta.layoutComponent">
  <RouterView />
</component>

</template>