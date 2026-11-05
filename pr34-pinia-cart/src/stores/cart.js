import { defineStore } from 'pinia'

/** @typedef {{id: number, name: string, price: number}} Product */
/** @typedef {Product & {quantity: number}} CartItem */

// При открытии приложения пробуем восстановить корзину. Испорченный JSON
// не должен мешать запуску, поэтому в таком случае начинаем с пустого списка.
function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('cart_items') || '[]')
    if (!Array.isArray(saved)) return []
    let count = 0
    return saved.filter(item => {
      const valid = item && Number.isInteger(item.id) && typeof item.name === 'string'
        && Number.isFinite(item.price) && item.price >= 0
        && Number.isInteger(item.quantity) && item.quantity > 0
      if (!valid || count + item.quantity > 10) return false
      count += item.quantity
      return true
    })
  } catch { return [] }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: /** @type {CartItem[]} */ (readCart()),
    previousItems: /** @type {CartItem[] | null} */ (null),
    warning: '',
  }),
  getters: {
    // Суммы вычисляются из items, а не хранятся отдельно: так они не устареют.
    count: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
    sum: state => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    canUndo: state => state.previousItems !== null,
  },
  actions: {
    remember() {
      // Нужна копия объектов: изменение количества не должно менять снимок.
      this.previousItems = this.items.map(item => ({ ...item }))
      this.warning = ''
    },
    /** @param {Product} product */
    addToCart(product) {
      if (this.count >= 10) {
        this.warning = 'В корзине может быть не больше 10 товаров суммарно.'
        return false
      }
      this.remember()
      const existing = this.items.find(item => item.id === product.id)
      if (existing) existing.quantity += 1
      else this.items.push({ ...product, quantity: 1 })
      this.saveToLocalStorage()
      return true
    },
    /** @param {number} id */
    removeFromCart(id) {
      if (!this.items.some(item => item.id === id)) return
      this.remember()
      this.items = this.items.filter(item => item.id !== id)
      this.saveToLocalStorage()
    },
    /** @param {number} id @param {number} delta */
    updateQuantity(id, delta) {
      const item = this.items.find(item => item.id === id)
      if (!item || !Number.isInteger(delta) || delta === 0) return
      // Лимит проверяем и для кнопки «+», а не только в каталоге.
      if (delta > 0 && this.count + delta > 10) {
        this.warning = 'В корзине может быть не больше 10 товаров суммарно.'
        return false
      }
      this.remember()
      item.quantity += delta
      if (item.quantity <= 0) this.items = this.items.filter(row => row.id !== id)
      this.saveToLocalStorage()
      return true
    },
    clearCart() {
      if (!this.items.length) return
      this.remember()
      this.items = []
      this.saveToLocalStorage()
    },
    undo() {
      if (!this.canUndo) return
      // По заданию отменяется последнее действие; повторная отмена недоступна.
      this.items = this.previousItems.map(item => ({ ...item }))
      this.previousItems = null
      this.warning = ''
      this.saveToLocalStorage()
    },
    saveToLocalStorage() {
      try { localStorage.setItem('cart_items', JSON.stringify(this.items)) }
      catch { this.warning = 'Браузер не разрешил сохранить корзину после перезагрузки.' }
    },
  },
})
