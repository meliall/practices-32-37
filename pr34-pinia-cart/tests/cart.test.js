import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useCartStore } from '../src/stores/cart.js'
import { useFavoritesStore } from '../src/stores/favorites.js'
const product = { id: 1, name: 'Ноутбук', price: 75000 }

beforeEach(() => {
  const values = new Map()
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  setActivePinia(createPinia())
})
test('Добавление считает количество и стоимость', () => {
  const cart = useCartStore(); cart.addToCart(product); cart.addToCart(product)
  assert.equal(cart.count, 2); assert.equal(cart.sum, 150000)
  assert.equal(cart.items.length, 1)
})
test('Одиннадцатый товар не добавляется ни из каталога, ни кнопкой плюс', () => {
  const cart = useCartStore()
  for (let i = 0; i < 10; i++) cart.addToCart(product)
  assert.equal(cart.addToCart(product), false)
  assert.equal(cart.updateQuantity(1, 1), false)
  assert.equal(cart.count, 10); assert.ok(cart.warning)
})
test('Уменьшение до нуля удаляет строку, отмена восстанавливает её', () => {
  const cart = useCartStore(); cart.addToCart(product); cart.updateQuantity(1, -1)
  assert.equal(cart.count, 0); cart.undo(); assert.equal(cart.count, 1)
})
test('Отмена количества использует отдельный снимок и работает один раз', () => {
  const cart = useCartStore(); cart.addToCart(product); cart.updateQuantity(1, 2)
  assert.equal(cart.count, 3); cart.undo(); assert.equal(cart.count, 1)
  assert.equal(cart.canUndo, false); cart.undo(); assert.equal(cart.count, 1)
})
test('Удаление и очистка корзины отменяются', () => {
  const cart = useCartStore(); cart.addToCart(product); cart.removeFromCart(1); cart.undo()
  assert.equal(cart.count, 1); cart.clearCart(); assert.equal(cart.count, 0)
  cart.undo(); assert.equal(cart.count, 1)
})
test('Корзина восстанавливается из сохранённого JSON', () => {
  const cart = useCartStore(); cart.addToCart(product)
  setActivePinia(createPinia())
  assert.equal(useCartStore().count, 1)
  assert.equal(JSON.parse(localStorage.getItem('cart_items'))[0].name, 'Ноутбук')
})
test('Испорченное хранилище не мешает открытию приложения', () => {
  localStorage.setItem('cart_items', '{broken')
  assert.equal(useCartStore().count, 0)
})
test('Избранное находится во втором store и не меняет корзину', () => {
  const favorites = useFavoritesStore(); favorites.toggle(1)
  assert.equal(favorites.count, 1); assert.equal(useCartStore().count, 0)
  favorites.toggle(1); assert.equal(favorites.count, 0)
})
