import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(), svgLoader(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {                                          // 1
        target: 'https://e701-84-54-90-60.ngrok-free.app', // 2
        changeOrigin: true,                              // 3
        rewrite: (path) => path.replace(/^\/api/, '')    // 4
      }
    }
  }
})
