<script setup>
import { Form } from "ant-design-vue";
import { useModal } from "@/utils/composable";
const { openModal: openCancelModal, open: openCancel, closeModal: closeCancelModal } = useModal();
const { openModal: openApplyModal, open: openApply, closeModal: closeApplyModal } = useModal();


import { reactive, ref } from "vue";
import { CheckboxGroup } from "ant-design-vue";


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



const options = [
  "Hujjatlar to'liq taqdim qilinmagan",

  "Hujjatlar to'liq taqdim qilinmagans",
  "Boshqa"
]

const state = reactive({
  checkAll: false,
  checkedList: [false, true]
})

</script>



<template>
  <Card title="Ma'lumotlar">
    <ARow :gutter="[12, 24]">
      <ACol span="6">
        <Info label="Murojaat turi" :value="data.title || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Murojaat raqami" :value="data.number || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Murojaat vaqti" :value="data.startTime || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Murojaat davomiyligi" :value="data.duration || '-'" />
      </ACol>
      <ACol span="24">
        <Info label="Hujjatlar" color-value="#7367F0">
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

  <Card title="Rasmiylashtirish">
    <Form layout="vertical">
      <ARow :gutter="[20, 20]">
        <ACol span="8">
          <Input />
        </ACol>
        <ACol span="8">
          <Input />
        </ACol>
        <ACol span="8">
          <Input />
        </ACol>
      </ARow>
      <div class="form-action">
        <Button class="form-action__btn _1" color="#EA5455" @click="openCancelModal">Qaytarish</Button>
        <Button class="form-action__btn _2" @click="openApplyModal">Rasmiylashtirish</Button>
      </div>
    </Form>
  </Card>
  <Modal :open="openCancel" @cancel="closeCancelModal" title="Ushbu murojaatni nima sababdan qaytarmoqchisiz?">
    <div class="modal modal-cancel">
      <div class="modal-actions">
        <CheckboxGroup :options="options" v-model:value="state.checkedList" />
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF">Ortga</Button>
          <Button color="#EA5455">Qaytarish</Button>
        </div>
      </div>
    </div>
  </Modal>

  <Modal :open="openApply" @cancel="closeApplyModal" title="Diqqat">
    <span class="modal-subtitle">Siz ushbu murojaatni rasmiylashtirmoqchimisz</span>
    <div class="modal modal-cancel">
      <div class="modal-actions">
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" borderColor="#FFF">YO'Q</Button>
          <Button>HA</Button>
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
  }

  &-cancel {}
}
</style>