<script setup>
// Для неизвестного URL выводим 404 и предлагаем вернуться на главную.
import PageLayout from '../components/PageLayout.vue'
</script>

<template>
  <PageLayout>
    <section class="panel not-found">
      <p class="eyebrow">Ошибка 404</p>
      <h1>Страница не найдена</h1>
      <p>Проверьте адрес или вернитесь на главную страницу.</p>
      <RouterLink class="button" to="/">На главную</RouterLink>
    </section>
  </PageLayout>
</template>
