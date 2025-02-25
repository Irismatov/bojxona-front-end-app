<script setup>
import { ref } from 'vue';

const messages = [
    {
        text: "Assalomu aleykum. Invoice qayta yuboring",
        time: "12:00",
        type: "received"
    },
    {
        text: "Assalomu aleykum. Invoice qayta yuboring",
        time: "12:00",
        type: "sent"
    },
    {
        text: "Assalomu aleykum. Invoice qayta yuboring",
        time: "12:00",
        type: "received"
    },
    {
        text: "Assalomu aleykum. Invoice qayta yuboring",
        time: "12:00",
        type: "sent"
    },
    {
        text: "Assalomu aleykum. Invoice qayta yuboring",
        time: "12:00",
        type: "received"
    },
    {
        text: "Assalomu aleykum. Invoice qayta yuboring",
        time: "12:00",
        type: "sent"
    }
];

const newMessage = ref();

</script>


<template>
    <div class="chat-container">
        <div class="chat-box">
            <div v-for="(message, index) in messages" :key="index" class="chat-message" :class="message.type">
                <span class="chat-message__text">{{ message.text }}</span>
                <span class="chat-message__time">{{ message.time }}</span>
            </div>
        </div>
        <div class="chat-input">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
            <button @click="sendMessage">Send</button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.chat {
    &-container {
        width: 400px;
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
    }

    &-box {
        height: 300px;
        overflow-y: auto;
        padding: 10px;
        display: flex;
        flex-direction: column;
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
}
</style>