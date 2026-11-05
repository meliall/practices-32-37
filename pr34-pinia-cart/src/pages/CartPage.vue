<script setup>
import { useCartStore } from '../stores/cart'
const cartStore = useCartStore()

function downloadCart() {
  // JSON.stringify превращает актуальную корзину в текстовый JSON-файл.
  const json = JSON.stringify({ items: cartStore.items, count: cartStore.count, total: cartStore.sum }, null, 2)
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'cart.json'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
</script>
<template>
  <main class="page">
    <h1>Корзина</h1>
    <div class="cart-summary"><span><strong>Товаров:</strong> {{ cartStore.count }}</span><span><strong>Итого:</strong> {{ cartStore.sum.toLocaleString('ru-RU') }} ₽</span></div>
    <p v-if="cartStore.warning" class="warning" role="alert">{{ cartStore.warning }}</p>
    <section class="panel">
      <ul v-if="cartStore.items.length" class="cart-list">
        <li v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-info"><strong>{{ item.name }}</strong><span>{{ item.price.toLocaleString('ru-RU') }} ₽ × {{ item.quantity }}</span></div>
          <div class="item-actions">
            <button class="secondary" :aria-label="`Уменьшить: ${item.name}`" @click="cartStore.updateQuantity(item.id, -1)">−</button>
            <button class="secondary" :aria-label="`Увеличить: ${item.name}`" @click="cartStore.updateQuantity(item.id, 1)">+</button>
            <button class="danger" :aria-label="`Удалить: ${item.name}`" @click="cartStore.removeFromCart(item.id)">Удалить</button>
          </div>
        </li>
      </ul>
      <p v-else>Корзина пуста.</p>
      <div class="actions">
        <button v-if="cartStore.items.length" class="danger" @click="cartStore.clearCart()">Очистить корзину</button>
        <button class="secondary" :disabled="!cartStore.canUndo" @click="cartStore.undo()">Отменить</button>
        <button :disabled="!cartStore.items.length" @click="downloadCart">Скачать корзину</button>
      </div>
    </section>
    <p class="hint" style="margin-top:20px">Обновите страницу — корзина сохранится благодаря localStorage.</p>
  </main>
</template>
