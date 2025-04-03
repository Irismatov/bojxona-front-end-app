import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8585/api",
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }

});

axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;