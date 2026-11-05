import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authorize } from './guard'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/profile' },
    { path: '/login', component: () => import('../pages/LoginPage.vue'), meta: { guestOnly: true } },
    { path: '/register', component: () => import('../pages/RegistrationPage.vue'), meta: { guestOnly: true } },
    { path: '/profile', component: () => import('../pages/ProfilePage.vue'), meta: { requiresAuth: true, roles: ['user', 'admin'] } },
    { path: '/admin', component: () => import('../pages/AdminPage.vue'), meta: { requiresAuth: true, roles: ['admin'] } },
    { path: '/:pathMatch(.*)*', redirect: '/profile' },
  ],
})
// Guard выполняется перед каждым переходом, в том числе при вводе URL вручную.
router.beforeEach(to => authorize(to, useAuthStore()))
export default router
