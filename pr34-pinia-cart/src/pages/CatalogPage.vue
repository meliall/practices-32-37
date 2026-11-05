<script setup>
import { products } from '../data/products'
import { useCartStore } from '../stores/cart'
import { useFavoritesStore } from '../stores/favorites'
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
// Компонент не меняет items напрямую: все изменения выполняют actions store.
const addToCart = product => cartStore.addToCart(product)
</script>
<template>
  <main class="page">
    <h1>Каталог товаров</h1>
    <p>Добавьте товары, затем перейдите в <RouterLink to="/cart">корзину</RouterLink>.</p>
    <p v-if="cartStore.warning" class="warning" role="alert">{{ cartStore.warning }}</p>
    <div class="products-grid">
      <article v-for="product in products" :key="product.id" class="product-card">
        <h2>{{ product.name }}</h2><p>{{ product.price.toLocaleString('ru-RU') }} ₽</p>
        <div class="actions"><button :aria-label="`В корзину: ${product.name}`" @click="addToCart(product)">В корзину</button></div>
        <button class="secondary" :aria-label="`Избранное: ${product.name}`" :aria-pressed="favoritesStore.ids.includes(product.id)" @click="favoritesStore.toggle(product.id)">
          {{ favoritesStore.ids.includes(product.id) ? 'Убрать из избранного' : 'В избранное' }}
        </button>
      </article>
    </div>
    <p class="hint" style="margin-top:24px">В корзине может быть не больше 10 товаров суммарно.</p>
  </main>
</template>
