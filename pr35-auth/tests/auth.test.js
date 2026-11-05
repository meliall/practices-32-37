import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../src/stores/auth.js'
import { authorize } from '../src/router/guard.js'
beforeEach(() => {
  const values = new Map()
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
  setActivePinia(createPinia())
})
test('Демо-учётная запись admin получает роль администратора', () => {
  const auth = useAuthStore(); auth.login({ username: 'admin', password: 'admin123' })
  assert.equal(auth.isAdmin, true); assert.equal(auth.validateToken(), true)
})
test('Неверный пароль не создаёт сессию', () => {
  const auth = useAuthStore()
  assert.throws(() => auth.login({ username: 'user', password: 'wrong' }))
  assert.equal(auth.isAuthenticated, false)
})
test('Вариант 21: регистрация сразу авторизует только как user', () => {
  const auth = useAuthStore(); auth.register({ username: ' Анна ', password: 'demo123' })
  assert.equal(auth.role, 'user'); assert.equal(auth.user.username, 'Анна')
  assert.equal(auth.isAdmin, false); assert.equal(auth.validateToken(), true)
})
test('Авторизация сохраняется после повторного создания store', () => {
  useAuthStore().login({ username: 'user', password: 'user123' })
  setActivePinia(createPinia())
  assert.equal(useAuthStore().validateToken(), true)
})
test('Выход удаляет состояние и сохранённый токен', () => {
  const auth = useAuthStore(); auth.login({ username: 'user', password: 'user123' }); auth.logout()
  assert.equal(auth.isAuthenticated, false); assert.equal(localStorage.getItem('auth_token'), null)
})
test('Guard отправляет гостя на login с сохранением адреса', () => {
  const result = authorize({ meta: { requiresAuth: true }, fullPath: '/admin?tab=1' }, useAuthStore())
  assert.deepEqual(result, { path: '/login', query: { redirect: '/admin?tab=1' } })
})
test('Guard не допускает user на admin', () => {
  const auth = useAuthStore(); auth.login({ username: 'user', password: 'user123' })
  assert.equal(authorize({ meta: { requiresAuth: true, roles: ['admin'] }, fullPath: '/admin' }, auth), '/profile')
})
test('Сочетание чужого токена и роли не проходит проверку', () => {
  localStorage.setItem('auth_token', 'fake-user-token'); localStorage.setItem('auth_role', 'admin')
  assert.equal(useAuthStore().validateToken(), false)
})
