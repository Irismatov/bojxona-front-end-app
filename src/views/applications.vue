<script setup>
import ApplicationCard from "@/components/local/card/application.vue";
const routes = [
  {
    title: "Янги",
    count: 15,
    icon: "download",
    color: "115, 103, 240",
    path: "",
  },
  {
    title: "Жараёнда",
    count: 3,
    icon: "loop",
    color: "0, 207, 232",
    path: "progress",
  },
  {
    title: "Тўлов кутилмоқда",
    count: 159,
    color: "234, 84, 85",
    icon: "coins",
    path: "pending",
  },
  {
    title: "Якунланган",
    count: 1593,
    color: "40, 199, 111",
    icon: "tick",
    path: "finished",
  },
];
</script>
<template>
  <ARow :gutter="[16, 16]">
    <ACol span="6" v-for="item in routes">
      <ApplicationCard :data="item" />
    </ACol>
  </ARow>
  <RouterView></RouterView>
</template>
