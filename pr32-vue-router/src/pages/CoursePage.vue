<script setup>
// ID берём из текущего URL. computed пересчитает курс при изменении параметра.
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'
import PageLayout from '../components/PageLayout.vue'
import { courses } from '../data/courses'

const route = useRoute()
const course = computed(() => courses.find(item => String(item.id) === route.params.id))
provide('course', course)

// Относительные ссылки также работают при открытии адреса с завершающим /.
const relativeTab = tab => route.path.endsWith('/') ? `../${tab}` : tab
</script>

<template>
  <PageLayout>
    <RouterLink class="back-link" to="/courses">← Назад к списку</RouterLink>
    <template v-if="course">
      <p class="eyebrow">{{ course.category === 'frontend' ? 'Frontend' : 'Backend' }}</p>
      <h1>{{ course.title }}</h1>
      <nav class="tabs" aria-label="Вкладки курса">
        <RouterLink :to="relativeTab('description')">Описание</RouterLink>
        <RouterLink :to="relativeTab('program')">Программа</RouterLink>
        <RouterLink :to="relativeTab('reviews')">Отзывы</RouterLink>
      </nav>
      <section class="panel"><RouterView /></section>
    </template>
    <section v-else class="panel" role="status">
      <h1>Курс не найден</h1>
      <p>Курса с таким ID нет в каталоге.</p>
      <RouterLink class="button" to="/courses">Назад к списку</RouterLink>
    </section>
  </PageLayout>
</template>
