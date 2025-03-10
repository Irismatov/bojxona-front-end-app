<script setup>
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue';
import { useModal } from "@/utils/composable";
import axios from "@/plugins/axios";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';


const props = defineProps({
    senderId: { type: String, required: true },
    receiverId: { type: String, default: null }
});

const { open, toggleModal } = useModal();
const messages = ref([]);
const newMessage = ref('');
const client = ref(null);
const isConnected = ref(false);



function setSocket() {
    client.value = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        debug: function (str) {
            console.log(str)
        },
    })
    client.value.onConnect = function (frame) {
        console.log("Connected", frame);
        isConnected.value = true;

        client.value.subscribe(`/user/${props.receiverId}/queue/messages`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            messages.value.push(parsedMessage);
            console.log("Received message:", parsedMessage);
            console.log("AMMAMAMMM")
        })
    }

    client.value.onStompError = function (frame) {
        console.log('Broker reported error' + frame.headers['message']);
        console.log('Additional details' + frame.body);
        isConnected.value = true;
    }


    client.value.activate();
}



function sendMessage() {
    if (client.value && isConnected.value) {
        console.log(props.receiverId)
        const message = {
            senderId: props.senderId,
            receiverId: props.receiverId,
            content: newMessage.value,
            timestamp: Date.now(),
            isRead: false
        }
        client.value.publish({
            destination: '/app/chat',
            body: JSON.stringify({
                senderId: props.senderId,
                receiverId: props.receiverId,
                content: newMessage.value
            })
        });
        console.log("Message sent");
        messages.value.push(message);
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

</script>

<template>
    <ADrawer :open="open" @close="toggleModal(false)" :width="500">
        <div class="chat-container">
            <div class="chat-box">
                <div v-for="(message, index) in messages" :key="index" class="chat-message" :class="message.type">
                    <span class="chat-message__text">{{ message.content }}</span>
                    <span class="chat-message__time">{{ message.timestamp }}</span>
                </div>
            </div>
            <div class="chat-input">
                <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </ADrawer>

    <button class="chat-button" @click="onChatBtn">
        <Icon name="mail" />
        ЧАТ
    </button>
</template>


<style lang="scss" scoped>
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
    }

    &-message {
        background: #e3f2fd;
        padding: 8px 12px;
        margin: 4px 0;
        border-radius: 5px;
        align-self: flex-start;
        width: 50%;

        &.sent {
            background: #007bff;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            --local-time-color: #00CFE8;
        }

        &.received {
            background: #e3f2fd;
            color: black;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            --local-time-color: grey;
        }

        &__time {
            font-size: 12px;
            color: var(--local-time-color);
            margin-left: 10px;
        }
    }

    &-input {
        display: flex;
        padding: 10px;
        background: #ffffff;
        border-top: 1px solid #ddd;

        input {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            outline: none;
        }

        button {
            background: #007bff;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            margin-left: 5px;
            border-radius: 4px;

            &:hover {
                :hover {
                    background: #0056b3;
                }
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