import "@/assets/font/stylesheet.css"
import "@/assets/scss/main.scss"
import "vue-toastification/dist/index.css";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from "vue-toastification";
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import setupRouteGuards from '@/router/guards'
import { registerComponents } from './utils/component-registration'

const toastOptions = {
    timeout: false,
    
}

const app = createApp(App)
registerComponents(app)
app.use(createPinia()).use(router).use(Antd);
app.use(Toast, toastOptions);
setupRouteGuards()
app.mount('#app')
