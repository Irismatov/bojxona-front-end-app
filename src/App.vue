<script setup>




</script>
<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>

</template>