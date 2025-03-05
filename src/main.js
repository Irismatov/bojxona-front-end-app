import "@/assets/font/stylesheet.css"
import "@/assets/scss/main.scss"
import '@splidejs/splide/css';


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import setupRouteGuards from '@/router/guards'
import { registerComponents } from './utils/component-registration'




const app = createApp(App)
registerComponents(app)

app.use(createPinia())
app.use(router)
setupRouteGuards()

app.mount('#app')
