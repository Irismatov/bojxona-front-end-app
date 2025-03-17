<script setup>
import { useAuth } from "@/stores"
import { onMounted, computed } from "vue";

const auth = useAuth();
const user = computed(() => auth.user);


const menu = [
  {
    title: "Бош саҳифа",
    link: "/",
    icon: "home",
    roles: [0, 1, 2]
  },
  {
    title: "Ходимлар",
    link: "/employees",
    icon: "employees",
    roles: [0, 1]
  },
  {
    title: "Мурожаатлар",
    link: "/applications",
    icon: "applications",
    roles: [0, 1, 2]
  },
  {
    title: "Ҳисоботлар",
    link: "/reports",
    icon: "reports",
    roles: [0, 1]
  },
];


</script>
<template>
  <aside class="aside">
    <span class="aside-logo">Божхона Ҳамкор</span>
    <ul class="aside-menu">
      <template v-for="item in menu">
        <li v-if="item.roles.includes(user.roleId)" class="aside-menu__item">
          <RouterLink class="aside-menu__link" :to="item.link">
            <Icon :name="item.icon" />
            {{ item.title }}
          </RouterLink>
        </li>
      </template>
    </ul>
  </aside>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.aside {
  width: var(--width-aside);
  background: var(--white-1);
  box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.3);

  &-logo {
    font-size: 20px;
    padding: var(--space-16) 24px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    text-transform: capitalize;
    height: calc(var(--height-header) + var(--space-16) * 2);
  }

  &-menu {
    padding: 0 14px;

    &__item {
      &:not(:last-child) {
        margin-bottom: 4px;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 16px;
      gap: 8px;
      font-size: 15px;
      font-weight: 400;
      line-height: 130%;
      color: rgba(75, 70, 92, 1);
      border-radius: 6px;
      transition: all 0.2s ease-in-out;

      .icon {
        transition: all 0.2s ease-in-out;
        --icon-size: 22px;
        --icon-color: rgba(75, 70, 92, 1);
      }

      &:not(.router-link-exact-active, .router-link-active):hover {
        background: rgba(75, 70, 92, 0.04);
      }

      &.router-link-active {
        border-radius: 6px;
        background: linear-gradient(72deg,
            #7367f0 22.16%,
            rgba(115, 103, 240, 0.7) 76.47%);
        box-shadow: 0px 2px 6px 0px rgba(115, 103, 240, 0.48);
        color: white;

        .icon {
          --icon-color: white;
        }
      }
    }
  }
}
</style>