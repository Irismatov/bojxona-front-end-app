import "@/assets/font/stylesheet.css"
import "@/assets/scss/main.scss"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import messages from "./utils/constants/locale"
import App from './App.vue'
import router from './router'
import { registerComponents } from './utils/component-registration'



const i18n = createI18n({
    legacy: false,
    locale: 'uz',
    fallbackLocale: 'uz',
    messages,
})
const app = createApp(App)
registerComponents(app)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
