// Точка входа: создаём Vue-приложение, подключаем маршруты и стили.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(router).mount('#app')
