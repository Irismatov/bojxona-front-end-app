<script setup>
import { onMounted, h, onUnmounted, ref } from "vue";
import { notification, Button } from "ant-design-vue";
import { useRouter } from "vue-router";
import { MessageOutlined } from '@ant-design/icons-vue';
import { useAuth } from "@/stores"
import NotificationBox from "./_notification.vue"
import { Stomp } from "@stomp/stompjs";

const router = useRouter();
const auth = useAuth();

const isConnected = ref(false);
const socket = ref(null);
const client = ref(null);


function connect() {
  socket.value = new WebSocket(`ws://localhost:8585/ws?userId=${auth.user.id}`);
  client.value = Stomp.over(socket.value);

  client.value.connect({
    Authorization: "Bearer " + "yourJwtToken"
  }, function (frame) {
    client.value.subscribe(`/user/queue/notifications`, function (message) {
      console.log("(shaxsiy user habar: {})", message);
      let data = JSON.parse(message.body);
    });
    isConnected.value = true;
  }, function (error) {
    console.error("WebSocket ulana olmadi:", error);
    alert("WebSocket ulana olmadi! Server ishlayotganini tekshiring.");
  });
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

async function logout() {
  await router.push("/auth");
  auth.logout();
}

onMounted(() => {
  connect();
})
</script>
<template>
  <header class="header">
    <div class="header-buttons">

      <button class="header-notification">
        <NotificationBox />
      </button>
      <button class="header-user">
        <Icon class="header-user__icon" name="person" />
      </button>
      <ATooltip>
        <template #title>
          <span>Тизимдан чиқиш</span>
        </template>
        <button @click="logout()" class="header-logout">
          <Icon class="header-logout__logo" name="logout" />
        </button>
      </ATooltip>
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

  &-logout {
    @include btn-clean;
    width: 38px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: rgba($color: #000000, $alpha: 0.6);
    overflow: hidden;



    .icon {
      --icon-color: #FFF;
      --icon-size: 20px;
    }
  }
}
</style>
