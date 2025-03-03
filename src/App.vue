<script setup>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { onMounted } from "vue";




onMounted(() => {
  Fancybox.bind("[data-fancybox]", {
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: [
          "zoomIn",
          "zoomOut",
          "toggle1to1",
          "rotateCCW",
          "rotateCW",
        ],
        right: ["download", "thumbs", "close"],
      }
    }
  })
});

</script>
<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>

</template>