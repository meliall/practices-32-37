<script setup>
// Получаем тот же реактивный курс, который предоставил родитель через provide.
import { inject } from 'vue'
const course = inject('course')
</script>

<template>
  <h2>Описание курса</h2>
  <p>{{ course.description }}</p>
</template>
