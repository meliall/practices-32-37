// Точка входа: подключаем Vue, корневой компонент и общие стили.
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// Создаём приложение из App.vue и помещаем его в <div id="app"> из index.html.
createApp(App).mount('#app')
