import "@/assets/font/stylesheet.css"
import "@/assets/scss/main.scss"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import { message } from "ant-design-vue";
import setupRouteGuards from '@/router/guards'
import { registerComponents } from './utils/component-registration'

message.config({
    top: '0',
    right: '0',
    duration: 2,
    maxCount: 1,
    rtl: true,
    prefixCls: 'my-message',
});


const app = createApp(App)
registerComponents(app)
app.config.globalProperties.$message = message;
app.use(createPinia()).use(router).use(Antd);
setupRouteGuards()
app.mount('#app')
