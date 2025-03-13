<script setup>
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useModal, useChat } from "@/utils/composable";
import axios from "@/plugins/axios";
import { formatISO8601 } from '@/utils/mixins';
const { open, toggleModal, openModal, closeModal } = useModal();

const props = defineProps({
    senderId: { type: String, required: true },
    receiverId: { type: String, default: '9308e47e-be88-4aa0-879e-8a847c0dda0c' },
    newMessageCount: {
        type: Number,
        required: true
    },
    isOpenStart: {
        type: Boolean,
        default: false
    }
});

const chatBoxRef = ref(null);
const chat = useChat();
const messages = ref([]);
const newMessage = ref('');
const client = ref(null);
const isConnected = ref(false);
const selectedFile = ref(null);
const localCount = ref(0);

const count = computed(() => localCount.value + props.newMessageCount);

watch(messages, () => {
    nextTick(() => {
        if (chatBoxRef.value) {
            chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight;
        }
    });
}, { deep: true });

async function sendMessage() {
    const message = {
        senderId: props.senderId,
        receiverId: props.receiverId,
        content: newMessage.value,
        isRead: false,
    }
    chat.sendMessage(message);
    messages.value.push(message);
    newMessage.value = '';

    if (client.value && isConnected.value) {
        if (selectedFile.value) {
            console.log(selectedFile.value)
            console.log(props.senderId);
            const formData = new FormData();
            formData.append('senderId', props.senderId);
            formData.append('receiverId', props.receiverId);
            formData.append('content', newMessage.value);
            formData.append('file', selectedFile.value);
            try {
                const response = await axios.post('/messages/with-file', formData);
                messages.value.push(response.data);
            } catch (err) {
                console.log(err)
            } finally {
                selectedFile.value = null;
            }

        } else {
            const message = {
                senderId: props.senderId,
                receiverId: props.receiverId,
                content: newMessage.value,
                isRead: false,
            }
            chatStore.sendMessage(message);
            messages.value.push(message);
        }
        newMessage.value = '';
    } else {
        console.log("Web socket not connected yet");
    }
}

async function fetchData() {
    const response = await axios.get(`messages/${props.senderId}/${props.receiverId}`);
    messages.value = response.data;
}

function uploadFile(event) {
    selectedFile.value = event.target.files[0];
}

function onOpen() {
    fetchData();
    openModal();
    localCount.value = - props.newMessageCount;
}

function onClose() {
    toggleModal(false);
}

function onIncomingMessage(incoming) {
    messages.value.push(incoming);
    localCount.value += 1;
}


onMounted(() => {
    if (props.isOpenStart) {
        fetchData();
        open.value = true;
    }
    chat.connect();
    chat.on('message', onIncomingMessage);
})

onUnmounted(() => {
    chat.disconnect();
})

</script>

<template>
    <button @click="onOpen" class="button">
        <div class="button-wrapper">
            <Icon name="mail" />
            <span v-if="count > 0" class="button-badge">
                {{ 1 }}
            </span>
        </div>
        <span class="button-text"> Мижоз билан мулоқот </span>
    </button>

    <ADrawer :open="open" @close="onClose" :width="500">
        <div class="chat-container">
            <div class="chat-box" ref="chatBoxRef">
                <div v-for="(message, index) in messages" :key="index" class="chat-message"
                    :class="message.senderId === props.senderId ? 'sent' : 'received'">
                    <a target="_blank" class="chat-message__file" v-if="message.attachment"
                        :href="message.attachment.downloadUrl">
                        <Icon name="paper-clip" />
                        <span>{{ message.attachment.fileName }}</span>
                    </a>
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

        input {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            outline: none;

            &__message {
                color: #A8AAAE;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: 0.43px;
            }
        }

        button {
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
                cursor: unset;
            }

            &:hover {
                opacity: 0.9;
            }
        }

        &__file {
            cursor: pointer;

            .icon {
                --icon-color: #A8AAAE;
                --icon-size: 24px;
            }
        }

    }
}
</style>