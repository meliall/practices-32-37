<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
const form = reactive({ username: '', password: '' })
const error = ref('')
const authStore = useAuthStore()
const router = useRouter()
async function register() {
  error.value = ''
  try {
    // Вариант 21: после демо-регистрации вход выполняется сразу с ролью user.
    authStore.register(form)
    await router.replace('/profile')
  } catch (err) { error.value = err.message }
}
</script>
<template>
  <main class="page"><section class="panel auth-form">
    <h1>Регистрация</h1><p>Демо-регистрация создаёт пользователя с ролью user.</p>
    <form @submit.prevent="register">
      <div class="form-group"><label for="new-login">Логин</label><input id="new-login" v-model="form.username" autocomplete="username" required minlength="2"></div>
      <div class="form-group"><label for="new-password">Пароль</label><input id="new-password" v-model="form.password" type="password" autocomplete="new-password" required minlength="6"></div>
      <button>Зарегистрироваться</button>
      <p v-if="error" class="error-message" role="alert">{{ error }}</p>
    </form>
    <p class="hint" style="margin-top:20px">Учебная имитация: реальная учётная запись на сервере не создаётся.</p>
  </section></main>
</template>
