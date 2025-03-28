<script setup>
import { Table, DatePicker, Button } from "ant-design-vue";
import { h } from 'vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import { ref, reactive, onMounted } from "vue";
import axios from "@/plugins/axios";
const fromDate = ref();
const toDate = ref();
const declarationTypes = [
   // {
   //    value: -1,
   //    text: "Барчаси"
   // },
   {
      value: "0",
      text: "МБ"
   },
   {
      value: "1",
      text: "АТ"
   },
   {
      value: "2",
      text: "ИМЕИ"
   }
];

const declarationStatuses = [
   {
      value: "new",
      text: "Янги"
   },
   {
      value: "progress",
      text: "Жараёнда"
   },
   {
      value: "pending",
      text: "Тўлов кутилмоқда"
   },
   {
      value: "finished",
      text: "Якунланган"
   }
]

const columns = [
   {
      title: "№",
      customRender: ({ index }) => {
         return index + 1;
      },
   },
   {
      title: "Рақами",
      dataIndex: "number",
   },
   {
      title: "Тури",
      dataIndex: "type",
      filters: declarationTypes,
   },
   {
      title: "Санаси",
      dataIndex: "date",
   },
   {
      title: "Мақоми",
      dataIndex: "status",
      filters: declarationStatuses,
   },
   {
      title: "Тулов суммаси",
      dataIndex: "totalAmount"
   },
   {
      title: "Туланган йигим",
      dataIndex: "paidAmount"
   },
   {
      title: "Сарфланган вақт",
      dataIndex: "spentTime"
   }
];

const list = ref([]);

</script>



<template>
   <div class="card">
      <div class="card-header">
         <h1 class="card-header__title">Ҳисоботлар</h1>
         <div class="card-header__action">
            <DatePicker v-model:value="fromDate" />
            <span>дан</span>
            <DatePicker v-model:value="toDate" />
            <span>гача</span>
            <Button :icon="h(SyncOutlined)" type="ghost" class="card-header__btn"/>
         </div>
      </div>
      <div class="card-body">
         <Table :columns="columns" :data-source="list" :pagination=true />
      </div>
   </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.card {
   background-color: #FFF;
   border-radius: 6px;
   background: #FFF;
   box-shadow: 0px 4px 18px 0px rgba(75, 70, 92, 0.10);
   overflow: hidden;
   padding: 24px;

   &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;

      &__action {
         display: flex;
         align-items: center;
         gap: 0 8px;
      }
      &__title {
         color: #4B465C;
         font-feature-settings: 'liga' off, 'clig' off;

         font-size: 18px;
         font-style: normal;
         font-weight: 600;
         line-height: 24px;
      }

      &__btn {
         @include btn-clean;
         border-radius: 6px;
         background: #7367F0;
         box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.30);
         height: 34px;
         padding: 0 18px;
         color: #FFF;
         font-feature-settings: 'liga' off, 'clig' off;

         font-size: 15px;
         font-style: normal;
         font-weight: 500;
         line-height: normal;
         letter-spacing: 0.43px;
         transition: all 0.2s ease-in-out;

         &:hover {
            background-color: #7367F0;
            color: #FFF;
         }
      }
   }


}
</style>