import { useAuth } from "@/stores";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import mitt from "mitt";
import { ref } from "vue";


export function useDeclStatusChange() {
    const isConnected = ref(false);
    const auth = useAuth();
    const client = ref(null);
    const emitter = mitt();


    function connect() {
        client.value = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8081/ws?userId=${auth.user.id}`),
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });
        client.value.onConnect = function (frame) {
            isConnected.value = true;

            client.value.subscribe('/topic', (message) => {
                const decl = JSON.parse(message.body);
                emitter.emit('change', decl.id);
            })
        };
        client.value.onStompError = function (frame) {
            console.log('Broker reported error' + frame.headers['message']);
            console.log('Additional details' + frame.body);
            isConnected.value = false;
        };
        client.value.activate();
    }

    function disconnect() {
        if (client.value) client.value.deactivate();
        isConnected.value = false;
    }

    return {
        isConnected,
        connect,
        disconnect,
        on: emitter.on,
        off: emitter.off
    }

}