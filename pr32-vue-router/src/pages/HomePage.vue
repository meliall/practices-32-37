<script setup>
// На главной странице оставлена простая ссылка на каталог, как разрешено заданием.
import PageLayout from '../components/PageLayout.vue'
</script>

<template>
  <PageLayout>
    <section class="panel home-panel">
      <p class="eyebrow">Frontend и Backend</p>
      <h1>Каталог курсов</h1>
      <p class="lead">Основы JavaScript, Vue.js и серверная разработка на Node.js.</p>
      <RouterLink class="button" to="/courses">Перейти к курсам</RouterLink>
    </section>
  </PageLayout>
</template>
