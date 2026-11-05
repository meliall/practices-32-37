// Здесь собраны маршруты каталога, дочерние вкладки и правила доступа.
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/HomePage.vue') },
    { path: '/courses', name: 'courses', component: () => import('../pages/CoursesListPage.vue') },
    {
      path: '/courses/:id',
      component: () => import('../pages/CoursePage.vue'),
      children: [
        { path: '', redirect: to => ({ name: 'course-description', params: to.params, query: to.query }) },
        { path: 'description', name: 'course-description', component: () => import('../pages/CourseDescriptionPage.vue') },
        { path: 'program', name: 'course-program', component: () => import('../pages/CourseProgramPage.vue') },
        { path: 'reviews', name: 'course-reviews', component: () => import('../pages/CourseReviewsPage.vue') },
      ],
    },
    { path: '/login', name: 'login', component: () => import('../pages/LoginPage.vue'), meta: { guestOnly: true } },
    { path: '/dashboard', name: 'dashboard', component: () => import('../pages/DashboardPage.vue'), meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../pages/NotFoundPage.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, from) => {
  let isAuthenticated = false
  try {
    isAuthenticated = Boolean(localStorage.getItem('authToken'))
  } catch {
    // При недоступном localStorage защищённый маршрут остаётся закрытым.
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'login',
      query: {
        // to — запрошенный защищённый адрес; from — предыдущая страница.
        redirect: to.fullPath,
        from: from.fullPath,
      },
    }
  }
  if (to.meta.guestOnly && isAuthenticated) return { name: 'dashboard' }
})

export default router
