import { defineStore } from "pinia";
import { ref } from "vue";
import { useAuth } from "@/stores";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useChatStore = defineStore('chat', () => {
    const isConnected = ref(false);
    const auth = useAuth();
    const client = ref(null);
    const newMessage = ref({});

    function setSocket() {
        client.value = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8081/ws?userId=${auth.user.id}`),
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        client.value.onConnect = function (frame) {
            console.log("Connected", frame);
            isConnected.value = true;

            client.value.subscribe(`/user/queue/messages`, (message) => {
                const parsedMessage = JSON.parse(message.body);
                newMessage.value = parsedMessage;
            })
        }
        client.value.onStompError = function (frame) {
            console.log('Broker reported error' + frame.headers['message']);
            console.log('Additional details' + frame.body);
            isConnected.value = false;
        }
        client.value.activate();
    }

    function sendMessage(message) {
        if (isConnected.value) {
            client.value.publish({
                destination: '/app/chat',
                body: JSON.stringify(message)
            })
        } else {
            console.log(message, ' was not sent because Web socket is not connected yet');
        }
    }

    function disconnect() {
        if (client.value) client.value.deactivate();
        isConnected.value = false;
    }

    return {
        isConnected,
        newMessage,
        setSocket,
        sendMessage,
        disconnect
    }
})