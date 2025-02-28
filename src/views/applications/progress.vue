<script setup>
import { Table, message } from "ant-design-vue";
import Icon from "../../components/global/icon.vue";
import axios from "@/plugins/axios";
import { ref, onMounted } from "vue";


async function fetchData() {
  const response = await axios.get(`/api/declarations/status/1/type/${activeTab.value}`, {
    params: {
      page: 0
    }
  });
  if (response.data.resultCode === 0) {
    list.value = response.data.list;
    message.info("Murojaatlar yuklandi");
  } else {
    message.error("Murojaatlarni yuklashda xatolik yuz berdi", response.resultNote);
  }
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


const list = ref([]);


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