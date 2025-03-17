<script setup>
import { useChat } from "@/utils/composable";
import { onMounted, h, onUnmounted, ref } from "vue";
import { notification, Button } from "ant-design-vue";
import { useRouter } from "vue-router";
import { MessageOutlined } from '@ant-design/icons-vue';
import { useAuth } from "@/stores"
import axios from "@/plugins/axios";

const isLoading = ref();
const chat = useChat();
const router = useRouter();
const auth = useAuth();
const messages = ref([]);


async function fetchMessages(visible) {
  if (visible) {
    const response = await axios.get("/messages/unread", {
      params: {
        userId: auth.user.id
      }
    });
    messages.value = response.data;
  }
}


const notify = (message) => {
  auth.user.notificationCount += 1;
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
        <a-popover @openChange="fetchMessages" placement="bottomLeft">
          <template #content>
            <div v-for="item in messages">
              <div class="header-notification__content">
                <span class="header-notification__msg" @click="router.push(`/applications/detail/${item.senderId}?chat=true`)">
                  {{ item.content }}
                </span>
              </div>
            </div>
          </template>
          <template #title>
            Янги хабарлар
          </template>
          <Icon name="notification" />
        </a-popover>
        <div v-if="auth.user.notificationCount > 0" class="header-notification__badge">
          {{ auth.user.notificationCount }}
        </div>
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
    position: relative;


    .icon {
      --icon-size: 26px;
      --icon-color: #4B465C;
    }

    &__content {}

    &__msg {
      display: block;
      width: 100%;
      min-height: 40px;
      padding: 8px 8px;
      color: #4B465C;
      font-feature-settings: 'liga' off, 'clig' off;
      font-family: "Public Sans";
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      margin-bottom: 12px;
      border-bottom: 1px solid #DBDADE;
      border-radius: 6px;
      box-shadow: 0px 4px 16px 0px rgba(165, 163, 174, 0.45);

      &:hover {
        cursor: pointer;
        background-color: rgba(75, 70, 92, 0.16);
      }
    }



    &__badge {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 50%;
      top: 50%;
      transform: translate(0, -100%);
      background-color: #ff0000;
      color: #FFF;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
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
