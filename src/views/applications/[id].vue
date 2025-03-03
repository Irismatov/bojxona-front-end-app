<script setup>
import { Form, CheckboxGroup, Checkbox, Textarea, Select, FormItem, message } from "ant-design-vue";
import { useRoute } from "vue-router";
import { useModal, useDeclarations } from "@/utils/composable";
import { ref, onMounted, computed, reactive } from "vue";
import axios from "@/plugins/axios";

const route = useRoute();
const { openModal: openCancelModal, open: openCancel, closeModal: closeCancelModal } = useModal();
const { openModal: openApplyModal, open: openApply, closeModal: closeApplyModal } = useModal();
const { isLoading, changeDeclarationStatus, formatType } = useDeclarations();

async function requestToChangeStatus() {
  await changeDeclarationStatus(route.params.id, 3, "Murojaat rasmiylashtirildi");
  closeApplyModal();
}

const optionsFancyBox = {
  Toolbar: {
    display: {
      left: ["infobar"],
      middle: [
        "zoomIn",
        "zoomOut",
        "toggle1to1",
        "rotateCCW",
        "rotateCW",
        "flipX",
        "flipY",
      ],
      right: ["slideshow", "thumbs", "close"],
    },
  },
};



async function fetchData() {
  const response = await axios.get(`/api/declarations/${route.params.id}`);
  if (response.data.resultCode === 0) {
    data.value = response.data;
    documents.value = data.value.documents;

    console.log(documents.value);
    //fetchDocs(data.value.docIds);
  } else {
    message.error("Xatolik yuz berdi");
  }
}

const documents = ref([]);


// async function fetchDocs(docIds) {
//   for (const doc of docIds) {
//     const response = await axios.get(`/api/declaration_docs/id/${doc.docId}`);

//     if (response.data.resultCode === 0) {
//       documents.push({
//         value: response.data.image,
//         type: doc.docType
//       });
//     }
//   }
// }

function formatDocName(type) {
  if (type === 0) {
    return "Паспорт олди"
  } else if (type === 1) {
    return "Паспорт орка"
  } else if (type === 2) {
    return "Техпаспорт олди"
  } else if (type === 3) {
    return "Техпаспорт орка"
  } else if (type === 4) {
    return "Юк ташиш рухсатномаси"
  } else {
    return type
  }
}


function formatTimestamp(timestamp) {
  if (timestamp) {
    const date = new Date(timestamp * 1000); // UNIX timestamp sekund formatida keladi

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Oy 0 dan boshlanadi
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} --- ${hours}:${minutes}`;
  }
  return "-";
}


const data = ref({});


const cancelOptions = ref([]);

const applySelectOptions = ref([
  {
    value: '1',
    label: 'Bitta dokument',
  }
]);

const applySelectValue = ref("1");

onMounted(() => {
  fetchData();
})


// rasmni yuklash uchun bu qismi o'chirib yuboriladi
const file = ref(null);
const preview = ref(null);
const declType = ref(0);

const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;

    // Rasmni oldindan ko'rish uchub
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value = e.target.result;
    }
    reader.readAsDataURL(selectedFile);
  }
}

const uploadImage = async () => {
  if (!file.value) {
    message.warn("Iltimos, rasm yuklang!");
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);
  formData.append("type", declType.value);

  try {
    const response = await axios.post(`/declaration-docs/${route.params.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    fetchData();
    message.success("Rasm yuklandi");
  } catch (error) {
    message.error("Xatolik yuz berdi");
    console.error("Xatolik", error);
  }
}

</script>

<template>
  <!-- rasm yuklash uchun bu qismi ochirib yuboriladi -->
  <div class="upload">
    <input type="file" @change="handleFileChange" accept="image/*"/>
    <input type="number" v-model="declType" max="3" min="0" value="0"/>
    <Button @click="uploadImage">Rasmni yuklash</Button>
    <div v-if="preview">
      <h3>Tanlangan rasm: </h3>
      <img :src="preview" width="200"/>
    </div>
  </div>

  


  <Card title="Маълумотлар">
    <ARow :gutter="[12, 24]">
      <ACol span="6">
        <Info label="Мурожаат тури" :value="formatType(data.type) || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Мурожаат рақами" :value="data.declNumber || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Мурожаат вақти" :value="formatTimestamp(data.createdAt) || '-'" />
      </ACol>
      <ACol span="6">
        <Info label="Мурожаат давомийлиги" :value="data.duration || '-'" />
      </ACol>
      <ACol span="24">
        <Info label="Ҳужжатлар" color-value="#7367F0">
          <template #value>
            <template v-for="(item, index) in documents">
              <a :href="`data:image/jpeg;base64,${item.value}`"  :data-fancybox="`document`" :data-caption="formatDocName(item.type)"
                style="display: block;">
                {{ formatDocName(item.type) }}
              </a>
              



              <!-- <a :href="item.images[0]" :data-fancybox="`document-${index}`" style="display: block;">
                {{ "Doc " + index+1 }}
              </a>
              <a :href="link" v-for="link in item.links.slice(1)" :data-fancybox="`document-${index}`" v-show="false">
              </a> -->
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
      <!-- <p class="modal-apply__text">Танланг: </p>
      <Select ref="select" v-model:value="applySelectValue" :options="applySelectOptions" @focus="focus"
        @change="handleChange"></Select> -->

      <div class="modal-actions">
        <div class="modal-actions__btns">
          <Button bgColor="rgba(168, 170, 174, 0.16)" color="#A8AAAE" @click="closeApplyModal"
            borderColor="#FFF">ЙЎҚ</Button>
          <Button @click="requestToChangeStatus">ҲА</Button>
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