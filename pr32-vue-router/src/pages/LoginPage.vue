<script setup>
// После учебного входа возвращаемся на запрошенный защищённый адрес.
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '../components/PageLayout.vue'

const route = useRoute()
const router = useRouter()
const password = ref('')
const error = ref('')

async function login() {
  error.value = ''
  if (password.value !== '1234') {
    error.value = 'Неверный пароль. Попробуйте ещё раз.'
    return
  }
  try {
    localStorage.setItem('authToken', 'demo')
  } catch {
    error.value = 'Не удалось сохранить авторизацию. Разрешите localStorage в браузере.'
    return
  }

  const redirect = route.query.redirect
  // Возвращаем только на защищённый маршрут внутри приложения.
  const target = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? router.resolve(redirect) : null
  try {
    await router.replace(target?.meta.requiresAuth ? target.fullPath : '/dashboard')
  } catch {
    error.value = 'Не удалось открыть страницу. Попробуйте войти ещё раз.'
  }
}
</script>

<template>
  <PageLayout>
    <section class="panel auth-panel">
      <p class="eyebrow">Личный кабинет</p>
      <h1>Вход</h1>
      <p>Введите пароль для доступа к личному кабинету.</p>
      <form @submit.prevent="login">
        <label for="password">Пароль</label>
        <input id="password" v-model="password" type="password" autocomplete="current-password"
          required :aria-invalid="Boolean(error)" aria-describedby="password-hint login-error" />
        <p id="password-hint" class="hint">Учебный пароль: 1234</p>
        <p v-if="error" id="login-error" class="error" role="alert">{{ error }}</p>
        <button class="button" type="submit">Войти</button>
      </form>
    </section>
  </PageLayout>
</template>
