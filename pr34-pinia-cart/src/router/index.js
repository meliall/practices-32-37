import { createRouter, createWebHistory } from 'vue-router'
import CatalogPage from '../pages/CatalogPage.vue'
import CartPage from '../pages/CartPage.vue'

// Как в теории, каталог и корзина — два отдельных маршрута.
export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Catalog', component: CatalogPage },
    { path: '/cart', name: 'Cart', component: CartPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
