import { useAuth } from "@/stores";
import mitt from "mitt";
import { ref } from "vue";
import { Stomp } from "@stomp/stompjs";


export function useChat() {
    const isConnected = ref(false);
    const auth = useAuth();
    const socket = ref(null);
    const client = ref(null);
    const emitter = mitt();


    function connect() {
        socket.value = new WebSocket(`ws://localhost:8585/ws?userId=${auth.user.id}`);
        client.value = Stomp.over(socket.value);

        client.value.connect({
            Authorization: "Bearer " + "yourJwtToken"
        }, function (frame) {
            client.value.subscribe(`/user/queue/messages`, function (message) {
                console.log("(shaxsiy user habar: {})", message);
                let data = JSON.parse(message.body);
                emitter.emit("message", data);
            });
            isConnected.value = true;
        }, function (error) {
            console.error("WebSocket ulana olmadi:", error);
            alert("WebSocket ulana olmadi! Server ishlayotganini tekshiring.");
        });
    }

    function sendMessage(message) {
        if (isConnected.value) {
            console.log(message, " msg by ", auth.user.id);
            client.value.send(`/app/send-message`, {}, JSON.stringify(message));
        } else {
            console.log("Web Socket is not connected. Couldn't send message", message);
        }
    }


    function disconnect() {
        if (client.value) client.value.deactivate();
        isConnected.value = false;
    }

    return {
        isConnected,
        connect,
        sendMessage,
        disconnect,
        on: emitter.on,
        off: emitter.off
    }

}