// Проверку вынесли в отдельную функцию, чтобы тестировать правила без браузера.
export function authorize(to, auth) {
  if (to.meta.requiresAuth && !auth.validateToken()) {
    auth.logout()
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  // Пользователь user может открыть профиль, но не панель администратора.
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) return '/profile'
  if (to.meta.guestOnly && auth.validateToken()) return '/profile'
}
