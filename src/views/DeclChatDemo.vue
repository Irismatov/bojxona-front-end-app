<script setup>
import { ref, onMounted } from 'vue';
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";


const senderId = '9308e47e-be88-4aa0-879e-8a847c0dda0c';
const receiverId = '324787d6-45d5-42be-8e8a-54ff3db37dab';
const client = ref(null);
const isConnected = ref(null);

function setSocket() {
    client.value = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
        debug: function (str) {
            console.log(str);
        }
    });

    client.value.onConnect = function (frame) {
        console.log("Connected", frame);
        isConnected.value = true;


        client.value.subscribe(`/user/${senderId}/queue/messages`, (message) => {
            const parsedMessage = JSON.parse(message.body);
            console.log(parsedMessage);
        })
    }
    client.value.activate();
}


// Statik ma'lumotlar
const currentUser = ref('User1'); // Joriy foydalanuvchi (masalan, User1)
const otherUser = 'User2'; // Boshqa foydalanuvchi (masalan, User2)
const messages = ref([
    {
        sender: 'User1',
        content: 'Salom, qalaysan?',
        timestamp: '10:00',
    },
    {
        sender: 'User2',
        content: 'Yaxshi, senchi?',
        timestamp: '10:01',
    },
]);
const newMessage = ref(''); // Yangi xabar uchun input qiymati

// Xabar yuborish funksiyasi
const sendMessage = () => {
    if (newMessage.value.trim() === '') return; // Bo'sh xabar yuborilmaydi

    const message = {
        sender: currentUser.value,
        content: newMessage.value,
        timestamp: new Date().toLocaleTimeString().slice(0, 5), // Hozirgi vaqtni qisqa formatda olish
    };

    messages.value.push(message); // Xabarni ro'yxatga qo'shish
    newMessage.value = ''; // Inputni tozalash
};


onMounted(() => {
    setSocket();
})
</script>


<template>
    <div class="chat-container">
        <h2>Chat</h2>
        <div class="messages">
            <div v-for="(message, index) in messages" :key="index"
                :class="['message', message.sender === currentUser ? 'sent' : 'received']">
                <span class="sender">{{ message.sender }}:</span>
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