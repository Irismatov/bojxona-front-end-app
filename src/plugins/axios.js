import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://d7e0-94-158-58-249.ngrok-free.app ",
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }

});

export default axiosInstance;