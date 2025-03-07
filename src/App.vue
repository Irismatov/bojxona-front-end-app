<script setup>
import '@splidejs/splide/css/sea-green';




</script>
<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>

</template>