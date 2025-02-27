<script setup>
import { Form, CheckboxGroup, Checkbox, Textarea, Select, FormItem } from "ant-design-vue";

import { useModal } from "@/utils/composable";
import { ref } from "vue";


const { openModal: openCancelModal, open: openCancel, closeModal: closeCancelModal } = useModal();
const { openModal: openApplyModal, open: openApply, closeModal: closeApplyModal } = useModal();



const data = {
  title: "AT - yukli avtotransport",
  number: 2025070799111,
  startTime: "09:55 01.02.2025",
  duration: "16 min",
  docs: [
    {
      title: "Texpasport oldi taraf",
      links: ["/images/doc-1.jpg", "/images/doc-1.jpg", "/images/doc-1.jpg"],
    },
    {
      title: "Texpasport orqa taraf",
      link: "/images/doc-2.jpg",
      links: ["/images/doc-2.jpg", "/images/doc-2.jpg", "/images/doc-2.jpg"],
    },
    {
      title: "Pasport oldi taraf",
      link: "/images/doc-1.jpg",
      links: ["/images/doc-1.jpg", "/images/doc-1.jpg", "/images/doc-1.jpg"],
    },
    {
      title: "Pasport orqa taraf",
      link: "/images/doc-2.jpg",
      links: ["/images/doc-2.jpg", "/images/doc-2.jpg", "/images/doc-2.jpg"],
    },
    {
      title: "Dozvol",
      link: "/images/doc-1.jpg",
      links: ["/images/doc-2.jpg", "/images/doc-2.jpg", "/images/doc-2.jpg"],
    },
    {
      title: "CMR",
      link: "/images/doc-2.jpg",
      links: ["/images/doc-1.jpg", "/images/doc-1.jpg", "/images/doc-1.jpg"],
    },
    {
      title: "Invoys",
      link: "/images/doc-1.jpg",
      links: ["/images/doc-1.jpg", "/images/doc-1.jpg", "/images/doc-1.jpg"],
    },
    {
      title: "Notarif hujjatlar",
      link: "/images/doc-2.jpg",
      links: ["/images/doc-1.jpg", "/images/doc-1.jpg", "/images/doc-1.jpg"],
    },
    {
      title: "Kafolat hujjatlari",
      link: "/images/doc-1.jpg",
      links: ["/images/doc-1.jpg", "/images/doc-1.jpg", "/images/doc-1.jpg"],
    },
  ],
};

const cancelOptions = ref([]);

const applySelectOptions = ref([
  {
    value: '1',
    label: 'Bitta dokument',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'disabled',
    label: 'Disabled',
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe',
  },
]);

const applySelectValue = ref("1");

</script>



<template>
  <Card title="Маълумотлар">
    <ARow :gutter="[12, 24]">
      <ACol span="6">
        <Info label="Мурожаат тури" :value="data.title || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Мурожаат рақами" :value="data.number || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Мурожаат вақти" :value="data.startTime || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Мурожаат давомийлиги" :value="data.duration || '-'" />
      </ACol>
      <ACol span="24">
        <Info label="Ҳужжатлар" color-value="#7367F0">
          <template #value>
            <template v-for="(item, index) in data.docs">
              <a :href="item.links[0]" :data-fancybox="`document-${index}`" style="display: block;">
                {{ item.title }}
              </a>
              <a :href="link" v-for="link in item.links.slice(1)" :data-fancybox="`document-${index}`" v-show="false">
              </a>
            </template>
          </template>
        </Info>
      </ACol>
    </ARow>
  </Card>

  <Card title="Расмийлаштириш">
    <Form layout="vertical">
      <ARow :gutter="[20, 20]">
        <ACol span="8">
          <FormItem>
            <Input />
          </FormItem>
        </ACol>
        <ACol span="8">
          <FormItem>
            <Input />
          </FormItem>
        </ACol>
        <ACol span="8">
          <FormItem>
            <Input />
          </FormItem>
        </ACol>
      </ARow>
      <div class="form-action">
        <Button class="form-action__btn _1" color="#EA5455" @click="openCancelModal">Қайтариш</Button>
        <Button class="form-action__btn _2" @click="openApplyModal">Расмийлаштириш</Button>
      </div>
    </Form>
  </Card>
  <Modal :open="openCancel" @cancel="closeCancelModal" title="Диққат"
    subtitle="Ушбу мурожаатни нима сабабдан қайтармоқчисиз?">
    <div class="modal modal-cancel">
      <div class="modal-actions">
        <div class="modal-actions__checkbox">
          <CheckboxGroup v-model:value="cancelOptions" style="width: 100%">
            <ARow :gutter="[8, 8]">
              <ACol :span="24">
                <Checkbox value="documentIsNotValid">Ҳужжат тўлиқ тақдим этилмаган</Checkbox>
              </ACol>
              <ACol :span="24">
                <Checkbox value="imageIsNotValid">Сурат яхши эмас</Checkbox>
              </ACol>
              <ACol :span="24">
                <Checkbox value="applicantIsNotResponding">Мурожаатчи жавоб бермаяпти</Checkbox>
              </ACol>
              <ACol :span="24">
                <Checkbox value="other">Бошқа</Checkbox>
              </ACol>
              <ACol :span="24">
                <Textarea :rows="3" placeholder="Бошқа сабаб киритинг" :disabled="!cancelOptions.includes('other')">
              </Textarea>
              </ACol>
            </ARow>
          </CheckboxGroup>
        </div>
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF"
            @click="closeCancelModal">Ортга</Button>
          <Button color="#EA5455">Қайтариш</Button>
        </div>
      </div>
    </div>
  </Modal>

  <Modal :open="openApply" @cancel="closeApplyModal" title="Диққат"
    subtitle="Сиз ушбу мурожаатни расмийлаштирмоқчимисиз">
    <div class="modal modal-apply">
      <p class="modal-apply__text">Танланг: </p>
      <Select ref="select" v-model:value="applySelectValue" :options="applySelectOptions" @focus="focus"
        @change="handleChange"></Select>

      <div class="modal-actions">
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF">ЙЎҚ</Button>
          <Button>ҲА</Button>
        </div>
      </div>
    </div>
  </Modal>

</template>


<style lang="scss" scoped>
.form {
  &-action {
    display: flex;
    gap: 20px;

    &__btn {
      &._1 {
        margin-left: auto;
      }
    }
  }
}

.modal {

  &-actions {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &__btns {
      display: flex;
      gap: 10px;
      margin-left: auto;
    }

    &__checkbox {
      ::v-deep() {
        .ant {
          &-checkbox {
            &-wrapper {
              span {
                color: #4B465C;
                font-feature-settings: 'liga' off, 'clig' off;
                font-family: "Public Sans";
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 21px;
              }
            }
          }
        }
      }
    }
  }

  &-apply {

    &__text {
      color: #4B465C;
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: "Public Sans";
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 4px;
    }

    ::v-deep() {
      .ant {
        &-select {
          width: 200px;

          &:hover .ant-select-selector {
            border: 1px solid #7367F0 !important;
          }

          &-selector {
            border-radius: 4px;
            border: 1px solid #7367F0;
            background: #FFF;

            .ant-select:hover & {
              border: 1px solid #7367F0;
            }
          }

          &-selection {
            &-item {
              color: #4B465C;
              font-feature-settings: 'liga' off, 'clig' off;
              font-family: "Public Sans";
              font-size: 13px;
              font-style: normal;
              font-weight: 400;
              line-height: 21px;
              display: flex;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>