<script setup>
import { useChat } from "@/utils/composable";
import { onMounted, h, onUnmounted } from "vue";
import { notification, Button } from "ant-design-vue";
import { useRouter } from "vue-router";
import { MessageOutlined } from '@ant-design/icons-vue';


const chat = useChat();
const router = useRouter();




const notify = (message) => {
  const key = `open${Date.now()}`;
  notification.open({
    message: 'Билдиришнома',
    description: 'Мижоз янги хабар юборди',
    icon: () => h(MessageOutlined, { style: 'color: #108ee9' }),
    btn: () =>
      h(
        Button,
        {
          type: 'primary',
          size: 'small',
          onClick: () => {
            router.push(`/applications/detail/${message.senderId}?chat=true`)
            notification.close(key);
          },
        },
        {
          default: () => 'Ўқиш',
        },
      ),
    key
  });
};

onMounted(() => {
  chat.connect();
  chat.on('message', notify);
})
onUnmounted(() => {
  chat.disconnect();
})
</script>
<template>
  <header class="header">
    <div class="header-buttons">
      <button class="header-notification">
        <Icon name="notification" />
      </button>
      <button class="header-user">
        <Icon class="header-user__icon" name="person" />
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.header {
  height: var(--height-header);
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-radius: 6px;
  background: white;
  box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.3);

  &-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-left: auto;
  }

  &-notification {
    @include btn-clean;

    .icon {
      --icon-size: 26px;
      --icon-color: #4B465C;
    }
  }


  &-user {
    @include btn-clean;
    width: 38px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: rgba(115, 103, 240, 1);
    overflow: hidden;



    .icon {
      --icon-color: #FFF;
      --icon-size: 20px;
    }
  }
}
</style>
