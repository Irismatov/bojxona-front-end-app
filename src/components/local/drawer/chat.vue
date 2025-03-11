<script setup>
import { ref } from 'vue';
import { useModal } from "@/utils/composable";
import axios from "@/plugins/axios";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { formatISO8601 } from '@/utils/mixins';


const props = defineProps({
    senderId: { type: String, required: true },
    receiverId: { type: String, default: null }
});

const { open, toggleModal } = useModal();
const messages = ref([]);
const newMessage = ref('');
const client = ref(null);
const isConnected = ref(false);
const selectedFile = ref(null);



function setSocket() {
    client.value = new Client({
        webSocketFactory: () => new SockJS(`http://localhost:8081/ws?userId=${props.senderId}`),
        debug: function (str) {
            console.log(str)
        },
    })
    client.value.onConnect = function (frame) {
        console.log("Connected", frame);
        isConnected.value = true;

        client.value.subscribe(`/user/queue/messages`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            messages.value.push(parsedMessage);
        })
    }

    client.value.onStompError = function (frame) {
        console.log('Broker reported error' + frame.headers['message']);
        console.log('Additional details' + frame.body);
        isConnected.value = true;
    }


    client.value.activate();
}

async function sendMessage() {
    if (client.value && isConnected.value) {
        if (selectedFile.value) {
            console.log(selectedFile.value)
            const formData = new FormData();
            formData.append('senderId', props.senderId);
            formData.append('receiverId', props.receiverId);
            formData.append('content', newMessage.value);
            formData.append('file', selectedFile.value);
            try {
                const response = await axios.post('/messages/with-file', formData);
                messages.value.push(response.value);
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
                timestamp: Date.now(),
                isRead: false,
            }
            client.value.publish({
                destination: '/app/chat',
                body: JSON.stringify({
                    senderId: props.senderId,
                    receiverId: props.receiverId,
                    content: newMessage.value
                })
            });
            messages.value.push(message);
        }

        newMessage.value = '';
    } else {
        console.log("Web socket not connected yet");
    }
}

async function onChatBtn() {
    toggleModal(true);
    setSocket();
    await fetchData();
}

async function fetchData() {
    const response = await axios.get(`messages/${props.senderId}/${props.receiverId}`);
    messages.value = response.data;
}

function uploadFile(event) {
    selectedFile.value = event.target.files[0];
}

</script>

<template>
    <ADrawer :open="open" @close="toggleModal(false)" :width="500">
        <div class="chat-container">
            <div class="chat-box">
                <div v-for="(message, index) in messages" :key="index" class="chat-message"
                    :class="message.senderId === props.senderId ? 'sent' : 'received'">
                    <span class="chat-message__text">{{ message.content }}</span>
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
                <button :class="{ 'disabled': !newMessage }" class="chat-input__btn" @click="sendMessage">Жўнатиш</button>
            </div>
        </div>
    </ADrawer>

    <button class="chat-button" @click="onChatBtn">
        <Icon name="mail" />
        ЧАТ
    </button>
</template>


<style lang="scss" scoped>
@use "@/assets/scss/config/mixins" as *;

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
        height: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
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

    &-button {
        position: fixed;
        right: -15px;
        bottom: 50px;
        border-radius: 8px;
        border: 1px solid var(--local-border-color);
        height: 38px;
        padding: 0 30px 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background-color: #f1c40f;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        color: #FFF;
        font-size: 16px;
        font-weight: bold;

        .icon {
            --icon-color: #FFF;
        }
    }
}
</style>