<script setup>
// Отзывы берём у выбранного курса, а не храним отдельную копию данных.
import { inject } from 'vue'
const course = inject('course')
</script>

<template>
  <h2>Отзывы о курсе</h2>
  <article v-for="(review, index) in course.reviews" :key="index" class="review">
    <div class="review-heading">
      <h3>{{ review.author }}</h3>
      <span class="rating">Оценка: {{ review.rating }} / 5</span>
    </div>
    <p>{{ review.text }}</p>
  </article>
  <p v-if="!course.reviews.length">Отзывов пока нет.</p>
</template>
