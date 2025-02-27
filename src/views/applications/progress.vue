<script setup>
import { Table } from "ant-design-vue";
import Icon from "../../components/global/icon.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const toDetail = () => {

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
    dataIndex: "type",
  },
  {
    title: "Рақами",
    dataIndex: "number",
  },
  {
    title: "Жўнатилган вақт",
    dataIndex: "sentTime",
  },
  {
    title: "Қабул вақти",
    dataIndex: "receivedTime",
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

const list = [
  {
    type: "IMEI",
    number: 202501019557,
    sentTime: "01.02.2025 09:55",
    receivedTime: "01.02.2025 09:55",
    timer: "3 min",
  },
  {
    type: "IMEI",
    number: 202501019557,
    sentTime: "01.02.2025 09:55",
    receivedTime: "01.02.2025 09:55",
    timer: "3 min",
  },
  {
    type: "IMEI",
    number: 202501019557,
    sentTime: "01.02.2025 09:55",
    receivedTime: "01.02.2025 09:55",
    timer: "3 min",
  },
  {
    type: "IMEI",
    number: 202501019557,
    sentTime: "01.02.2025 09:55",
    receivedTime: "01.02.2025 09:55",
    timer: "3 min",
  },
];
</script>

<template>
  <Table :data-source="list" :columns="columns">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <div class="action">
          <Button class="action-link__btn _1">
            <Icon name="mail" />
          </Button>
          <RouterLink :to="`/applications/detail/1`">
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