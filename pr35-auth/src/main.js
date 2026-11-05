import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()
// Сначала подключаем Pinia: защитники маршрутов тоже используют store.
app.use(pinia)
app.use(router)
app.mount('#app')
