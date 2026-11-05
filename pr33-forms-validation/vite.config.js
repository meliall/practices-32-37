import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Плагин Vue позволяет Vite обрабатывать файлы .vue: script, template и style.
export default defineConfig({ plugins: [vue()] })
