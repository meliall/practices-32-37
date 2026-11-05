import { defineStore } from 'pinia'

// Избранное — отдельное хранилище. Его счётчик в шапке обновляется
// независимо от того, на какой странице пользователь нажал кнопку.
export const useFavoritesStore = defineStore('favorites', {
  state: () => ({ ids: [] }),
  getters: { count: state => state.ids.length },
  actions: {
    toggle(id) {
      if (this.ids.includes(id)) this.ids = this.ids.filter(value => value !== id)
      else this.ids.push(id)
    },
  },
})
