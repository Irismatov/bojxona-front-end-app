import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }

});

export default axiosInstance;