<script setup>
import { Table } from "ant-design-vue";
import Icon from "../../components/global/icon.vue";
import { useRouter } from "vue-router";
import axios from "@/plugins/axios";
import { ref, onMounted, computed } from "vue";

const router = useRouter();



async function fetchData() {
  const response = await axios.get(`/declarations`, {
    params: {
      status: 1,
      type: activeTab.value
    }
  });
  list.value = response.data.content;
}


const columns = [
  {
    title: "№",
    customRender: ({ index }) => {
      return index + 1;
    }
  },
  {
    title: "Тури",
    customRender: ({ record }) => formatType(record.type),
  },
  {
    title: "Рақами",
    dataIndex: "number",
  },
  {
    title: "Жўнатилган вақт",
    dataIndex: "createdAt",
  },
  {
    title: "Қабул вақти",
    dataIndex: "startedAt",
  },
  {
    title: "Таймер",
    dataIndex: "timer",
  },
  {
    title: "Муносабат",
    key: "action",
  },
];

function formatType(type) {
  if (type === 0) {
    return "МБ"
  } else if (type === 1) {
    return "AT"
  } else {
    return "ИМЕИ"
  }
}

function updateTimer(time) {
      const pastDate = new Date(this.time.replace(' ', 'T'));
      const currentDate = new Date();
      
      // Farqni millisekundlarda hisoblash
      const diffMs = currentDate - pastDate;
      
      // Farqni kun, soat, daqiqa va sekundlarga aylantirish
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      // Natijani formatlash
      let result = '';
      if (days > 0) result += `${days} kun `;
      if (hours > 0) result += `${hours} soat `;
      if (minutes > 0) result += `${minutes} daqiqa `;
      result += `${seconds} sekund`;
      
      return result;
};

const list = ref([]);

// const list = [
//   {
//     type: "IMEI",
//     number: 202501019557,
//     sentTime: "01.02.2025 09:55",
//     receivedTime: "01.02.2025 09:55",
//     timer: "3 min",
//   },
//   {
//     type: "IMEI",
//     number: 202501019557,
//     sentTime: "01.02.2025 09:55",
//     receivedTime: "01.02.2025 09:55",
//     timer: "3 min",
//   },
//   {
//     type: "IMEI",
//     number: 202501019557,
//     sentTime: "01.02.2025 09:55",
//     receivedTime: "01.02.2025 09:55",
//     timer: "3 min",
//   },
//   {
//     type: "IMEI",
//     number: 202501019557,
//     sentTime: "01.02.2025 09:55",
//     receivedTime: "01.02.2025 09:55",
//     timer: "3 min",
//   },
// ];

const tabs = [
  {
    value: null,
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

const activeTab = ref(null);

const handleTabChange = (value) => {
  activeTab.value = value;
  console.log(activeTab.value);
  fetchData();
};



onMounted(() => {
  fetchData();
});
</script>

<template>
  <Tab :list="tabs" v-model="activeTab" @change="handleTabChange" />

  <Table :data-source="list" :columns="columns">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <div class="action">
          <Button class="action-link__btn _1">
            <Icon name="mail" />
          </Button>
          <RouterLink :to="`/applications/detail/${record.id}`">
            <Button class="action-link__btn _2">
              Кўриш
            </Button>
          </RouterLink>
        </div>
      </template>
    </template>
  </Table>
</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.action {
  display: flex;
  gap: 16px;

  &-link {

    &__btn {
      &._1 {
        &:hover {
          .icon {
            --icon-color: white;
          }
        }
      }

      .icon {
        --icon-color: #7367F0;
      }
    }
  }
}
</style>