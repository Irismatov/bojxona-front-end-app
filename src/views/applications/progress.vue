<script setup>
import { useDeclarations, useChat, useTimer } from "@/utils/composable"
import { ref, onMounted, reactive, h, onUnmounted } from "vue";
import ActionBtn from "@/components/local/button/action.vue";
import { useRouter } from 'vue-router';
import { formatTimestamp } from "@/utils/mixins"


const router = useRouter();
const { list, totalElements, getDeclarations, formatType } = useDeclarations();
const chat = useChat();
const { timers, updateTimers } = useTimer();
let timerInterval;








async function fetchData() {
  await getDeclarations(2, activeTab.value, { page: pagination.page - 1, size: 10 })
}

const pagination = reactive({
  page: 1,
  total: totalElements
});

const columns = [
  {
    title: "№",
    customRender: ({ index }) => {
      return index + 1;
    }
  },
  {
    title: "Тури",
    customRender: ({ record }) => formatType(record.declType),
  },
  {
    title: "Рақами",
    dataIndex: "declNumber",
  },
  {
    title: "Жўнатилган вақт",
    customRender: ({ record }) => formatTimestamp(record.createdAt)
  },
  {
    title: "Қабул вақти",
    customRender: ({ record }) => formatTimestamp(record.receivedAt)
  },
  {
    title: "Таймер",
    key: "timer",
  },
  {
    key: "action",
  },
];

const tabs = [
  {
    value: -1,
    label: "Барчаси"
  },
  {
    value: "0",
    label: "МБ"
  },
  {
    value: "1",
    label: "АТ"
  },
  {
    value: "2",
    label: "ИМЕИ"
  }
];

const activeTab = ref(-1);

const handleTabChange = (value) => {
  activeTab.value = value;
  pagination.page = 1;
  fetchData();
};

function onIncomingMessage(message) {
  list.forEach(item => {
    if (message.senderId === item.id) {
      item.newMessageCount += 1;
    }
  });
  notify(message);
}

onMounted(() => {
  fetchData();
  chat.connect();
  chat.on('message', onIncomingMessage)
  console.log(list)
  updateTimers(list);
  timerInterval = setInterval(updateTimers(list), 1000);
});
onUnmounted(() => {
  chat.disconnect();
  // Interval to'xtatilishi kerak
  clearInterval(timerInterval);
})
</script>

<template>
  <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />
  <ATable :data-source="list" :columns="columns">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div style="display: flex; gap: 16px;">
          <RouterLink :to="`/applications/detail/${record.declId}?chat=true`">
            <ATooltip>
              <template #title>
                <span>Мижоздан келган хабар</span>
              </template>
              <ActionBtn icon="mail" :isActive="record.newMessageCount > 0" />
            </ATooltip>
          </RouterLink>
          <RouterLink :to="`/applications/detail/${record.declId}`">
            <ATooltip>
              <template #title>
                <span>Мурожаатни кўриш</span>
              </template>
              <ActionBtn icon="eye" />
            </ATooltip>
          </RouterLink>
        </div>
      </template>
      <template v-else-if="column.key === 'timer'">
        {{ timers[record.declId] }}
      </template>
    </template>
  </ATable>
  <Pagination v-if="totalElements > 0" :pagination="pagination" :fetchData="fetchData" />


</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
</style>