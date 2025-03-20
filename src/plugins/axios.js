import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.1.4:8686/api",
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
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;