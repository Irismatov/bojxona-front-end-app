import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://e701-84-54-90-60.ngrok-free.app",
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }

});

export default axiosInstance;