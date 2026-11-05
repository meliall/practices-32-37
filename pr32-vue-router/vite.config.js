// Плагин позволяет Vite собирать компоненты Vue из файлов .vue.
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({ plugins: [vue()] })
