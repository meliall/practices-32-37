<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const data = ref(null)
const error = ref('')

async function fetchProtectedData() {
  if (loading.value) return
  loading.value = true
  error.value = ''
  data.value = null
  try {
    // Проверяем токен перед запросом, а не только при открытии страницы.
    if (!authStore.validateToken()) {
      authStore.logout()
      await router.replace('/login?redirect=/admin')
      return
    }
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
    })
    if (response.status === 401) {
      authStore.logout()
      await router.replace('/login?redirect=/admin')
      return
    }
    if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`)
    data.value = await response.json()
  } catch (err) { error.value = err.message || 'Произошла ошибка сети' }
  finally { loading.value = false }
}
</script>
<template>
  <main class="page"><section class="panel">
    <h1>Панель администратора</h1><p>Здесь только администраторы.</p>
    <p v-if="loading" role="status">Загрузка…</p>
    <div v-if="data"><h2>Данные, доступные только админу</h2><pre>{{ JSON.stringify(data, null, 2) }}</pre></div>
    <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    <div class="actions"><button :disabled="loading" @click="fetchProtectedData">Запросить защищённые данные</button><button class="secondary" @click="router.push('/profile')">Назад в профиль</button></div>
    <p class="hint">Учебная проверка прав выполняется в приложении. JSONPlaceholder — открытый тестовый API.</p>
  </section></main>
</template>
