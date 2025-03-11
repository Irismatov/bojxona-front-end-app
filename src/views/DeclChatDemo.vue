<script setup>
import { ref, onMounted } from 'vue';
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs';
import axios from "@/plugins/axios"

const senderId = '9308e47e-be88-4aa0-879e-8a847c0dda0c';
const receiverId = '324787d6-45d5-42be-8e8a-54ff3db37dab';
const client = ref(null);
const isConnected = ref(null);



function setSocket() {
    client.value = new Client({
        webSocketFactory: () => new SockJS(`http://localhost:8081/ws?userId=${senderId}`),
        debug: function (str) {
            console.log(str)
        }
    });
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
        isConnected.value = false;
    }

    client.value.activate();
}

const messages = ref([
]);
const newMessage = ref(''); // Yangi xabar uchun input qiymati

// Xabar yuborish funksiyasi
const sendMessage = () => {
    if (client.value && isConnected.value) {
        const message = {
            senderId: senderId,
            receiverId: receiverId,
            content: newMessage.value,
            timestamp: Date.now(),
            isRead: false
        };
        client.value.publish({
            destination: '/app/chat',
            body: JSON.stringify({
                senderId: senderId,
                receiverId: receiverId,
                content: newMessage.value
            })
        });
        messages.value.push(message);
        newMessage.value = '';
    }
};

async function fetchData() {
    const response = await axios.get(`messages/${senderId}/${receiverId}`);
    messages.value = response.data;
}


onMounted(() => {
    fetchData();
    setSocket();
})
</script>


<template>
    <div class="chat-container">
        <h2>Chat</h2>
        <div class="messages">
            <div v-for="(message, index) in messages" :key="index"
                :class="['message', message.senderId === senderId ? 'sent' : 'received']">
                <span class="content">{{ message.content }}</span>
                <span class="timestamp">{{ message.timestamp }}</span>
            </div>
        </div>
        <div class="input-area">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Xabar yozing..." />
            <button @click="sendMessage">Yuborish</button>
        </div>
    </div>
</template>



<style scoped>
.chat-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.messages {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
}

.message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 5px;
}

.sent {
    background-color: #d1e7dd;
    text-align: right;
}

.received {
    background-color: #f8d7da;
    text-align: left;
}

.sender {
    font-weight: bold;
    margin-right: 5px;
}

.content {
    word-break: break-word;
}

.timestamp {
    font-size: 0.8em;
    color: #666;
    margin-left: 10px;
}

.input-area {
    display: flex;
    gap: 10px;
}

input {
    flex: 1;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>