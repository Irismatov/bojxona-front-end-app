<script setup>
import { Input, FormItem } from "ant-design-vue";
const props = defineProps({
  label: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: undefined
  }
});


</script>
<template>
  <div class="input">
      <Input placeholder="Kiriting" />
  </div>
</template>



<style lang="scss" scoped>
.input {
  ::v-deep() {
    .ant {
      &-form {
        &-item {
          &-label {
            label {
              color: #4B465C;
              font-feature-settings: 'liga' off, 'clig' off;
              
              font-size: 13px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
            }
          }
        }
      }

      &-input {
        border-radius: 4px;
        border: 1px solid #7367F0;
        background: #FFF;
        box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.30);
        color: #4B465C;
        font-feature-settings: 'liga' off, 'clig' off;
        
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 21px;
      }
    }
  }
}
</style>
