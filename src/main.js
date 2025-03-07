import "@/assets/font/stylesheet.css"
import "@/assets/scss/main.scss"
import '@splidejs/splide/css';


import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import setupRouteGuards from '@/router/guards'
import { registerComponents } from './utils/component-registration'


const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
    }
};


const app = createApp(App)
registerComponents(app)

app.directive('click-outside', vClickOutside)
app.use(createPinia())
app.use(router)
setupRouteGuards()

app.mount('#app')
