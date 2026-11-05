<script setup>
// inject связывает вкладку с данными курса родительской страницы.
import { inject } from 'vue'
const course = inject('course')
</script>

<template>
  <h2>Программа курса</h2>
  <ol class="program">
    <li v-for="topic in course.program" :key="topic">{{ topic }}</li>
  </ol>
</template>
