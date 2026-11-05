<script setup>
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
</script>
<template>
  <header>
    <strong>Роли и доступ · Vue</strong>
    <template v-if="authStore.isAuthenticated"><span>Авторизован как {{ authStore.role }}</span><RouterLink to="/profile">Профиль</RouterLink></template>
    <nav v-else><RouterLink to="/login">Войти</RouterLink><RouterLink to="/register">Регистрация</RouterLink></nav>
  </header>
  <RouterView />
</template>
