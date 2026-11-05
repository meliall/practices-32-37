import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// Vite обрабатывает компоненты .vue с помощью этого плагина.
export default defineConfig({ plugins: [vue()] })
