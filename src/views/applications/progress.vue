<script setup>
import { useDeclarations, useChat } from "@/utils/composable"
import { ref, onMounted, reactive, onUnmounted } from "vue";
import ActionBtn from "@/components/local/button/action.vue";
import { formatTimestamp } from "@/utils/mixins"
import { useAuth } from "@/stores"

const { list, totalElements, getDeclarations, formatType } = useDeclarations();
const chat = useChat();
const auth = useAuth();

async function fetchData() {
  await getDeclarations(2, activeTab.value, { page: pagination.page - 1, size: 10 })
  setupCounters();
}

const pagination = reactive({
  page: 1,
  total: totalElements
});



const counters = ref({});
const counterIntervals = ref({});

function setupCounters() {
  Object.values(counterIntervals.value).forEach(interval => {
    clearInterval(interval);
  });

  list.forEach(el => {
    if (!el.receivedAt) return; 

    const receivedTime = new Date(el.receivedAt * 1000); 
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - receivedTime) / 1000);

    counters.value[el.declId] = formatElapsedTime(elapsedSeconds);

    counterIntervals.value[el.declId] = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - receivedTime) / 1000);
      counters.value[el.declId] = formatElapsedTime(elapsedSeconds);
    }, 1000);
  });
}

function formatElapsedTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return minutes + " мин ";
}




const columnsDeclarant = [
  {
    title: "№",
    customRender: ({ index }) => {
      return index + 1;
    },
    width: 50,
  },
  {
    title: "Тури",
    customRender: ({ record }) => formatType(record.declType),
    width: 300
  },
  {
    title: "Рақами",
    dataIndex: "declNumber",
    width: 300
  },
  {
    title: "Жўнатилган вақт",
    customRender: ({ record }) => formatTimestamp(record.createdAt),
    width: 300
  },
  {
    title: "Қабул вақти",
    customRender: ({ record }) => formatTimestamp(record.receivedAt),
    width: 300
  },
  {
    title: "Таймер",
    key: "timer",
    width: 300
  },
  {

  },
  {
    key: "action",
    width: 100
  },
];



const columnsAdmin = [
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
    key: "timer"
  },
  {
    title: "Декларант",
    customRender: ({ record }) => record.declarant?.pinfl
  }
]


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
});
onUnmounted(() => {
  chat.disconnect();
  Object.values(counterIntervals.value).forEach(interval => {
    clearInterval(interval);
  });
});
</script>

<template>
  <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />
  <ATable :pagination="false" :data-source="list" :columns="auth.user.roleId === 2 ? columnsDeclarant : columnsAdmin">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div style="display: flex; gap: 8px;">
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
        <span style="color: red;">
          {{ counters[record.declId] }}
        </span>
      </template>
    </template>
  </ATable>
  <Pagination v-if="totalElements > 0" :pagination="pagination" :fetchData="fetchData" />


</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;
</style>