<script setup>
// Фильтр берём из URL: поэтому ссылку с выбранной категорией можно открыть заново.
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '../components/PageLayout.vue'
import { courses } from '../data/courses'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const loadedCourses = ref([])
const filters = [
  { value: 'all', label: 'Все' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
]
const category = computed(() => route.query.category || 'all')
const filteredCourses = computed(() => category.value === 'all'
  ? loadedCourses.value
  : loadedCourses.value.filter(course => course.category === category.value))

function setCategory(value) {
  router.push({ path: '/courses', query: { ...route.query, category: value } })
}

let timer
let finishDelay
let unmounted = false
// Асинхронная задержка в 1000 мс даёт увидеть спиннер без настоящего бэкенда.
async function loadCourses() {
  loading.value = true
  error.value = ''
  try {
    await new Promise(resolve => {
      finishDelay = resolve
      timer = setTimeout(resolve, 1000)
    })
    if (unmounted) return
    if (!Array.isArray(courses)) throw new Error('Некорректные данные курсов')
    loadedCourses.value = courses
  } catch {
    error.value = 'Не удалось загрузить курсы. Попробуйте ещё раз.'
  } finally {
    loading.value = false
  }
}

onMounted(loadCourses)
onUnmounted(() => {
  unmounted = true
  clearTimeout(timer)
  finishDelay?.()
})
</script>

<template>
  <PageLayout>
    <p class="eyebrow">Обучение программированию</p>
    <h1>Каталог курсов</h1>
    <p class="lead">Выберите направление и познакомьтесь с программой курса.</p>
    <div class="filters" role="group" aria-label="Категория курса">
      <button v-for="filter in filters" :key="filter.value" type="button"
        :class="{ selected: category === filter.value }"
        :aria-pressed="category === filter.value" @click="setCategory(filter.value)">
        {{ filter.label }}
      </button>
    </div>
    <div v-if="loading" class="loading" role="status">
      <span class="spinner" aria-hidden="true"></span>Загрузка курсов…
    </div>
    <div v-else-if="error" role="alert" class="panel">
      <p class="error">{{ error }}</p>
      <button type="button" @click="loadCourses">Повторить</button>
    </div>
    <div v-else-if="filteredCourses.length" class="course-grid">
      <article v-for="course in filteredCourses" :key="course.id" class="course-card">
        <span class="badge">{{ course.category === 'frontend' ? 'Frontend' : 'Backend' }}</span>
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
        <RouterLink class="button" :to="`/courses/${course.id}`">Подробнее</RouterLink>
      </article>
    </div>
    <p v-else class="panel">В этой категории курсов нет. Выберите другой фильтр.</p>
  </PageLayout>
</template>
