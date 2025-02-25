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
    title: "Turi",
    dataIndex: "type",
  },
  {
    title: "Raqami",
    dataIndex: "number",
  },
  {
    title: "Jo'natilgan vaqt",
    dataIndex: "sentTime",
  },
  {
    title: "Qabul vaqti",
    dataIndex: "receivedTime",
  },
  {
    title: "Timer",
    dataIndex: "timer",
  },
  {
    title: "Munosabat",
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
          <!-- <button class="action-link__btn _1">
            <Icon name="mail" />
          </button> -->
          <RouterLink :to="`/applications/detail/1`">
            <Button class="action-link__btn _2">
              Ko'rish
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
        @include btn-clean;
      }

      .icon {
        --icon-color: #FF9F43;
      }
    }
  }
}
</style>