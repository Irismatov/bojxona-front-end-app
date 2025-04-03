<script setup>
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useModal, useChat } from "@/utils/composable";
import axios from "@/plugins/axios";
import { formatISO8601 } from '@/utils/mixins';
import { useAuth } from '@/stores';
import { getBlobUrl } from "@/utils/mixins";
const { open, toggleModal, openModal, closeModal } = useModal();
const auth = useAuth();

const props = defineProps({
    senderId: { type: String, required: true },
    receiverId: { type: String, default: undefined },
    newMessageCount: { type: Number, required: true },
    isOpenStart: { type: Boolean, default: false }
});

const chatBoxRef = ref(null);
const chat = useChat();
const messages = ref([]);
const newMessage = ref('');
const selectedFile = ref(null);
const localCount = ref(0);
const page = ref(0);
const pageSize = 20;
const hasMore = ref(true);
const isLoading = ref(false);
const scrollEventAdded = ref(false);
const initialLoadComplete = ref(false);

const count = computed(() => localCount.value + props.newMessageCount);

watch(() => props.receiverId, (newReceiverId) => {
    if (newReceiverId) {
        page.value = 0;
        hasMore.value = true;
        isLoading.value = false;
        initialLoadComplete.value = false;
        fetchData();
        if (props.isOpenStart) openModal();
    }
});

watch(messages, () => {
    if (!initialLoadComplete.value) {
        nextTick(() => {
            if (chatBoxRef.value) {
                chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
            }
        });
    }
}, { deep: true });

async function sendMessage() {
    if (!newMessage.value && !selectedFile.value) return;

    let message;
    if (selectedFile.value) {
        const formData = new FormData();
        formData.append('senderId', props.senderId);
        formData.append('receiverId', props.receiverId);
        formData.append('content', newMessage.value);
        formData.append('file', selectedFile.value);
        try {
            const response = await axios.post('/messages/with-file', formData);
            message = response.data;
            messages.value.push(message);
        } catch (err) {
            console.log(err);
        } finally {
            selectedFile.value = null;
        }
    } else {
        message = {
            declarationId: props.receiverId,
            content: newMessage.value
        }
        chat.sendMessage(message);
        messages.value.push(message);
    }

    newMessage.value = '';
    nextTick(() => {
        if (chatBoxRef.value) {
            const isAtBottom = chatBoxRef.value.scrollTop + chatBoxRef.value.clientHeight >=
                chatBoxRef.value.scrollHeight - 50;
            if (isAtBottom) {
                chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
            }
        }
    });
}

async function getMessageImg(id) {
    const response = await axios.get(`/chat/file?messageId=${id}`);
    console.log(response.data.file)
    return "data:image/jpeg;base64," + response.data.file;
}

async function fetchData(append = false) {
    if (isLoading.value || (!hasMore.value && append)) return;

    isLoading.value = true;
    try {
        const response = await axios.post(`/chat/declarant`,
            {
                userUuid: "a3343846-a477-431a-9ce7-2b43f3f1367d",
                declId: "9935d53c-45be-475b-8004-85405b834524"
            },
            {
                params: { page: page.value, size: pageSize }
            });
        const newMessages = response.data.messages || response.data;

        if (newMessages.length < pageSize) hasMore.value = false;

        if (append && chatBoxRef.value) {
            const scrollHeight = chatBoxRef.value.scrollHeight;
            const scrollPosition = chatBoxRef.value.scrollTop;
            messages.value = [...newMessages, ...messages.value];
            nextTick(() => {
                if (chatBoxRef.value) {
                    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight - scrollHeight + scrollPosition;
                }
            });
        } else {
            messages.value = newMessages;
            initialLoadComplete.value = true;
            nextTick(() => {
                if (chatBoxRef.value) {
                    chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
                }
            });
        }
    } catch (error) {
        console.log('Error fetching messages:', error);
    } finally {
        isLoading.value = false;
        await auth.fetchUserInfo();
    }
}

async function loadMoreMessages() {
    if (!hasMore.value || isLoading.value) return;
    page.value += 1;
    await fetchData(true);
}

function handleScroll() {
    if (chatBoxRef.value && chatBoxRef.value.scrollTop <= 50 && !isLoading.value && hasMore.value) {
        loadMoreMessages();
    }
}

function uploadFile(event) {
    selectedFile.value = event.target.files[0];
}

function onOpen() {
    page.value = 0;
    hasMore.value = true;
    initialLoadComplete.value = false;
    localCount.value = -props.newMessageCount;
    openModal();
    if (props.receiverId) fetchData();

    nextTick(() => {
        if (chatBoxRef.value && !scrollEventAdded.value) {
            chatBoxRef.value.addEventListener('scroll', handleScroll);
            scrollEventAdded.value = true;
        }
    });
}

function onClose() {
    page.value = 0;
    localCount.value = -props.newMessageCount;
    closeModal();
}

function onIncomingMessage(incoming) {
    messages.value.push(incoming);
    localCount.value += 1;
    nextTick(() => {
        if (chatBoxRef.value) {
            console.log(chatBoxRef.value.scrollTop);
            console.log(chatBoxRef.value.scrollHeight);
            console.log(chatBoxRef.value.clientHeight);
            console.log(chatBoxRef.value.scrollTop);

            const isAtBottom = chatBoxRef.value.scrollTop + chatBoxRef.value.clientHeight >= chatBoxRef.value.scrollHeight - 150;
            if (isAtBottom) {
                chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
            }
        }
    });
}

onMounted(() => {
    chat.connect();
    chat.on('message', onIncomingMessage);
    if (props.isOpenStart) {
        openModal();
        if (props.receiverId) fetchData();
        else isLoading.value = true;
    }
    nextTick(() => {
        if (chatBoxRef.value && !scrollEventAdded.value) {
            chatBoxRef.value.addEventListener('scroll', handleScroll);
            scrollEventAdded.value = true;
        }
    });
});

onUnmounted(() => {
    chat.disconnect();
    if (chatBoxRef.value && scrollEventAdded.value) {
        chatBoxRef.value.removeEventListener('scroll', handleScroll);
        scrollEventAdded.value = false;
    }
});
</script>
<template>
    <button @click="onOpen" class="button">
        <div class="button-wrapper">
            <Icon name="mail" />
            <span v-if="count > 0" class="button-badge">
                {{ count }}
            </span>
        </div>
        <span class="button-text"> Мижоз билан мулоқот </span>
    </button>

    <ADrawer :open="open" @close="onClose" :width="500">
        <div class="chat-container">
            <div v-if="isLoading && messages.length === 0" class="loading-indicator"> <a-spin size="large" /></div>
            <div class="chat-box" ref="chatBoxRef">
                <div v-for="(message, index) in messages" :key="index" class="chat-message"
                    :class="message.ownerType === 0 ? 'sent' : 'received'">
                    <template v-if="message.contentType === 1">
                        <img :src="getMessageImg(message.messageId)" />
                    </template>
                    <span v-if="message.content" class="chat-message__text">{{ message.content }}</span>
                    <span class="chat-message__time">{{ formatISO8601(message.timestamp) }}</span>
                </div>
            </div>

            <div v-if="selectedFile" class="chat-file">
                <span class="chat-file__name">{{ selectedFile.name }}</span>
                <button @click="selectedFile = null" class="chat-file__clear">✕</button>
            </div>
            <div class="chat-input">
                <input class="chat-input__msg" v-model="newMessage" @keyup.enter="sendMessage"
                    placeholder="Хабар ёзиш..." />
                <label for="file-upload" class="chat-input__file">
                    <Icon name="paper-clip" />
                </label>
                <input id="file-upload" type="file" @change="uploadFile" style="display: none;" />
                <button :class="{ 'disabled': !newMessage && !selectedFile }" class="chat-input__btn"
                    @click="sendMessage">Жўнатиш</button>
            </div>
        </div>
    </ADrawer>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

.loading-indicator {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.button {
    --local-size: 48px;
    border-radius: 8px 0 0 8px;
    position: fixed;
    right: 0px;
    bottom: 48px;
    display: flex;
    align-items: center;
    background-color: #7367F0;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border: none;
    padding: 0;
    transform: translateX(calc(100% - var(--local-size)));
    transition: all 0.2s ease-in-out;

    &:hover {
        transform: translateX(0);
    }

    &-wrapper {
        height: var(--local-size);
        width: var(--local-size);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    //   width: var(--local-size);
    .icon {
        --icon-color: #fff;
    }

    &-text {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        padding: 0 12px 0 0;
    }

    &-badge {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(0, -100%);
        background-color: #ff0000;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
}

.chat {
    &-container {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    &-box {
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
        margin-bottom: auto;
        gap: 8px;
        height: calc(100% - 60px);
        position: relative;
    }

    &-message {
        border-radius: 6px;
        box-shadow: 0px 2px 4px 0px rgba(165, 163, 174, 0.30);
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 8px 8px;

        &.sent {
            background: #7367F0;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }

        &.received {
            background: #A8AAAE;
        }

        &__text {
            color: #FFF;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 15px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: 0.43px;
            align-self: flex-start;
            word-break: break-all;
        }

        &__time {
            color: #FFF;
            align-self: flex-end;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: 0.43px;
        }

        &__file {
            @include btn-clean;
            gap: 0;
            color: #FFF;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 15px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            letter-spacing: 0.43px;

            span {
                @include slice(1);
            }

            .icon {
                --icon-color: #FFF;
                --icon-size: 20px;
            }
        }
    }

    &-file {
        background-color: rgba(75, 70, 92, 0.16);
        min-height: 30px;
        display: flex;
        align-items: center;
        padding: 0 12px;

        &__name {
            color: black;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 13px;
            font-style: normal;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0.43px;
            margin-right: auto;
        }

        &__clear {
            @include btn-clean;
            color: black;
            font-feature-settings: 'liga' off, 'clig' off;
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0.43px;
        }
    }

    &-input {
        display: flex;
        align-items: center;
        padding: 10px;
        background: #ffffff;
        border-top: 1px solid #ddd;
        height: 60px;

        &__msg {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            outline: none;
            color: #000;
            /* Message input rang to'g'irlash */
            background-color: #f5f5f5;
            /* Input fon rangi */
        }

        &__btn {
            background: #7367F0;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            margin-left: 5px;
            border-radius: 8px;
            transition: all 0.5s ease-in-out;

            &.disabled {
                background-color: #A8AAAE;
                cursor: not-allowed;
            }

            &:hover:not(.disabled) {
                opacity: 0.9;
            }
        }

        &__file {
            cursor: pointer;
            margin: 0 8px;

            .icon {
                --icon-color: #A8AAAE;
                --icon-size: 24px;
            }
        }
    }
}
</style>