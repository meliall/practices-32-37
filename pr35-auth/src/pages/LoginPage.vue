<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const form = reactive({ username: '', password: '' })
const isLoading = ref(false)
const error = ref('')

async function handleSubmit() {
  if (isLoading.value) return
  isLoading.value = true
  error.value = ''
  try {
    authStore.login({ username: form.username.trim(), password: form.password })
    // Возвращаем только на внутренний защищённый маршрут приложения.
    const target = route.query.redirect
    const safe = typeof target === 'string' && target.startsWith('/') && !target.startsWith('//')
    await router.replace(safe && router.resolve(target).meta.requiresAuth ? target : '/profile')
  } catch (err) { error.value = err.message || 'Ошибка входа' }
  finally { isLoading.value = false }
}
</script>
<template>
  <main class="page"><section class="panel auth-form">
    <h1>Вход в систему</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group"><label for="username">Логин</label><input id="username" v-model="form.username" autocomplete="username" required></div>
      <div class="form-group"><label for="password">Пароль</label><input id="password" v-model="form.password" type="password" autocomplete="current-password" required></div>
      <p class="hint">Демо-учётные записи: admin/admin123, user/user123</p>
      <button :disabled="isLoading">{{ isLoading ? 'Вход…' : 'Войти' }}</button>
      <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    </form>
    <p style="margin-top:20px"><RouterLink to="/register">Создать демо-учётную запись</RouterLink></p>
  </section></main>
</template>
