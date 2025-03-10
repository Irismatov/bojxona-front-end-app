import "@/assets/font/stylesheet.css"
import "@/assets/scss/main.scss"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import setupRouteGuards from '@/router/guards'
import { registerComponents } from './utils/component-registration'

const app = createApp(App)
registerComponents(app)
app.use(createPinia()).use(router).use(Antd);
setupRouteGuards()
app.mount('#app')
