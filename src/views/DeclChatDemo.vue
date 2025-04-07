<script setup>
import { ref, onMounted } from 'vue';
import SockJS from 'sockjs-client'
import { Client, Stomp } from '@stomp/stompjs';
import axios from "@/plugins/axios"
import plainAxios from "axios"

const senderId = 'a3343846-a477-431a-9ce7-2b43f3f1367d';
const declId = '9935d53c-45be-475b-8004-85405b834524';
const client = ref(null);
const isConnected = ref(null);

const socket = ref();
const stompClient = ref();





function setSocket() {

    socket.value = new WebSocket(`ws://localhost:8585/ws?userId=${senderId}`);

    client.value = Stomp.over(socket.value);

    client.value.connect({
        Authorization: "Bearer " + "yourJwtToken"
    }, function (frame) {
        console.log("WebSocketga ulandi: " + frame);
        isConnected.value = true;
        client.value.subscribe(`/user/queue/messages`, function (message) {
            console.log("(shaxsiy user habar: {})", message);
            let data = JSON.parse(message.body);
            messages.value.push(data);
        });

    }, function (error) {
        console.error("WebSocket ulana olmadi:", error);
        alert("WebSocket ulana olmadi! Server ishlayotganini tekshiring.");
    });
}

const messages = ref([
]);
const newMessage = ref(''); // Yangi xabar uchun input qiymati

// Xabar yuborish funksiyasi
const sendMessage = () => {
    if (client.value && isConnected.value) {
        const message = {
            declId: declId,
            content: newMessage.value,
            ownerType: 1
        };
        client.value.send(`/app/send-message`, {}, JSON.stringify(message));
        messages.value.push(message);
        newMessage.value = '';
    } else {
        alert("Web socket ulanishni tekshiring");
    }
};

const username = "70861023";
const password = "KJobnCMPTK";

// Base64 formatga o'tkazish
const basicAuth = "Basic " + btoa(`${username}:${password}`);

async function fetchData() {
    try {
        const response = await plainAxios.post(
            "http://localhost:8585/api/chat", // ✅ URL
            { // ✅ BODY (data)
                userUuid: "a3343846-a477-431a-9ce7-2b43f3f1367d",
                declId: "9935d53c-45be-475b-8004-85405b834524"
            },
            { // ✅ HEADERS
                headers: {
                    Authorization: basicAuth,
                    "Content-Type": "application/json" // JSON formatda yuborish
                }
            }
        );
        messages.value = response.data.messages;
    } catch (error) {
        console.error("Xatolik:", error);
    }
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
                :class="['message', message.ownerType === 1 ? 'sent' : 'received']">
                <span class="content">{{ message.content }}</span>
                <span class="timestamp">{{ message.instime }}</span>
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