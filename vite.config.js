import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // Barcha interfeyslar orqali ulanishga ruxsat beradi
    // Agar HMR (Hot Module Replacement) da muammo bo‘lsa, quyidagicha sozlang:
    hmr: {
      host: '90a1-94-158-58-249.ngrok-free.app'
    },
    // Zarurat bo‘lsa, CORS ni yoqishingiz mumkin:
    cors: true
  }
})
