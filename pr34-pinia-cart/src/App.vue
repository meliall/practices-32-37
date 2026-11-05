<script setup>
import { useCartStore } from './stores/cart'
import { useFavoritesStore } from './stores/favorites'
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
</script>
<template>
  <header>
    <strong>Магазин · Pinia</strong>
    <nav aria-label="Основная навигация"><RouterLink to="/">Каталог</RouterLink><RouterLink to="/cart">Корзина: {{ cartStore.count }}</RouterLink></nav>
    <span>Избранное: {{ favoritesStore.count }}</span>
  </header>
  <RouterView />
</template>
