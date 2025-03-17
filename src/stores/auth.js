import { defineStore } from "pinia";
import axios from "@/plugins/axios"

export const useAuth = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user') || 'null')
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userRole: (state) => state.user?.role || '',
    },

    actions: {
        async login(credentials) {
            try {
                const response = await axios.post(`/auth/employee/demo-token`, credentials);
                this.setSession(response.data);
                await this.fetchUserInfo();
                return true;
            } catch (error) {
                console.error('Login failed: ', error);
                return false;
            }
        },

        logout() {
            this.token = '';
            this.user = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },

        setSession(data) {
            this.token = data.token;
            this.user = data.user;
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        },

        async fetchUserInfo() {
            try {
                const response = await axios.get('/users/me');
                this.user = response.data;
                localStorage.setItem('user', JSON.stringify(response.data));
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user info: ', error);
                return null;
            }
        }

    }
})