<script setup>
// Эта страница открывается только после проверки токена в beforeEach.
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '../components/PageLayout.vue'

const router = useRouter()
const error = ref('')
async function logout() {
  error.value = ''
  try {
    localStorage.removeItem('authToken')
    await router.replace('/login')
  } catch {
    error.value = 'Не удалось выйти. Проверьте доступ к localStorage и повторите попытку.'
  }
}
</script>

<template>
  <PageLayout>
    <section class="panel">
      <p class="eyebrow">Ваш профиль</p>
      <h1>Личный кабинет. Вы авторизованы.</h1>
      <p>Вы можете просматривать курсы и переключаться между вкладками.</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="button" type="button" @click="logout">Выйти</button>
    </section>
  </PageLayout>
</template>
