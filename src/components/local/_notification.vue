<script setup>
import axios from "@/plugins/axios";
import { onMounted, ref } from "vue";
import { useAuth } from "@/stores";

const list = ref([]);
const auth = useAuth();


async function fetchData() {
    const response = await axios.get("/messages/unread", {
        params: {
            userId: auth.user.id
        }
    });
    list.value = response.data;
}


function onClickItem(item) {
    console.log(item);
}

function formatNotificationTime(item) {
    const now = new Date();
    const notificationDate = new Date(item.sentTime); // item.sentTime dan Date obyektini yaratamiz
    const diffMs = now - item.sentTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        if (diffHours === 0) {
            return `Бугун, ${diffMins} минут олдин`;
        }
        return `Бугун, ${diffHours} соат олдин`;
    }

    if (diffDays === 1) {
        return `Кеча, ${notificationDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${notificationDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
    }

    return `${notificationDate.getDate().toString().padStart(2, "0")}-${(
        notificationDate.getMonth() + 1
    )
        .toString()
        .padStart(2, "0")}-${notificationDate.getFullYear()}, ${notificationDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${notificationDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
}

function onOpen() {
    fetchData();
}
</script>

<template>
    <a-popover placement="bottomLeft" :onOpenChange="onOpen" overlay-class-name="notification-wrapper">
        <template #content>
            <div class="notification">
                <div class="notification-header">
                    <h3 class="notification-header__title">Хабарнома</h3>
                    <Icon name="email-open" class="notification-header__icon" />
                </div>
                <AEmpty v-if="!list.length" description="Хабарлар топилмади"></AEmpty>
                <template v-else>
                    <div class="notification-item" v-for="item in list" @click="onClickItem(item)">
                        <span class="notification-item__title">
                            {{ item.senderId }}
                        </span>
                        <span class="notification-item__subtitle">
                            {{ item.content }}
                        </span>
                        <span class="notification-item__time">
                            {{ item.timestamp }}
                        </span>
                    </div>
                </template>
            </div>
        </template>
        <Icon name="notification" />
    </a-popover>
    <!-- <div v-if="auth.user.notificationCount > 0" class="header-notification__badge">
        {{ auth.user.notificationCount }}
    </div> -->
</template>

<style lang="scss">
.notification {
    &>* {
        &:not(:last-child) {
            padding: 16px 24px;
            border-bottom: 1px solid #dbdade;
        }
    }

    &-wrapper {
        --local-width: 340px;
        min-width: var(--local-width);
        max-width: var(--local-width);
        border-radius: 6px;
        box-shadow: 0px 10px 20px 0px rgba(165, 163, 174, 0.4);

        .ant-popover {
            &-inner {
                padding: 0;
                max-width: var(--local-width);
            }
        }
    }

    &-header {
        display: flex;
        align-items: center;
        gap: 12px;

        &__title {

            flex: 1;
        }

        &__icon {
            --icon-size: 24px;
            --icon-color: var(--black-2);
        }
    }

    &-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
        padding: 16px 24px;
        cursor: pointer;

        &__title {
            color: #4B465C;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 15px;
            font-style: normal;
            font-weight: 600;
            line-height: 22px;
        }

        &__subtitle {
            color: #4B465C;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
        }

        &__time {
            color: #4B465C;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
        }

        &.done {
            padding-right: calc(24px + 16px);

            &::after {
                content: "";
                position: absolute;
                right: 24px;
                top: 16px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: var(--blue-1);
            }
        }


        &:hover {
            background-color: rgb(248, 248, 248);
        }
    }
}
</style>