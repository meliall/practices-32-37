<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const router = useRouter()
function logout() {
  authStore.logout()
  router.replace('/login')
}
</script>
<template>
  <main class="page"><section class="panel">
    <h1>Профиль пользователя</h1>
    <p>Логин: <strong>{{ authStore.user?.username || authStore.role }}</strong></p>
    <p>Роль: <strong>{{ authStore.role }}</strong></p>
    <div class="actions">
      <!-- Кнопку скрываем, но настоящая проверка роли всё равно есть в guard. -->
      <button v-if="authStore.isAdmin" @click="router.push('/admin')">Перейти в панель администратора</button>
      <button class="danger" @click="logout">Выйти</button>
    </div>
  </section></main>
</template>
