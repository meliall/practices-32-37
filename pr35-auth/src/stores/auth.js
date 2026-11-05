import { defineStore } from 'pinia'

// Восстанавливаем авторизацию после обновления страницы. Пароли не сохраняем.
function readSession() {
  try {
    return {
      token: localStorage.getItem('auth_token') || null,
      role: localStorage.getItem('auth_role') || null,
      user: JSON.parse(localStorage.getItem('auth_user') || 'null'),
    }
  } catch { return { token: null, role: null, user: null } }
}

export const useAuthStore = defineStore('auth', {
  state: () => readSession(),
  getters: {
    isAuthenticated: state => Boolean(state.token),
    isAdmin: state => state.role === 'admin',
    isUser: state => state.role === 'user',
  },
  actions: {
    login({ username, password }) {
      // Это учебные учётные записи из теории, а не запрос к настоящему серверу входа.
      if (username === 'admin' && password === 'admin123') {
        this.setSession('fake-admin-token', 'admin', { username: 'admin' })
      } else if (username === 'user' && password === 'user123') {
        this.setSession('fake-user-token', 'user', { username: 'user' })
      } else throw new Error('Неверный логин или пароль')
    },
    register({ username, password }) {
      // Вариант 21: демо-регистрация сразу создаёт сессию с ролью user.
      // Выбор роли пользователю не даём, поэтому получить admin через форму нельзя.
      const name = username.trim()
      if (name.length < 2) throw new Error('Логин должен содержать хотя бы 2 символа.')
      if (password.length < 6) throw new Error('Введите пароль не короче 6 символов.')
      this.setSession('fake-user-token', 'user', { username: name })
    },
    setSession(token, role, user) {
      // Записываем все части сессии вместе и только после успешной проверки данных.
      try {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_role', role)
        localStorage.setItem('auth_user', JSON.stringify(user))
      } catch { throw new Error('Браузер не разрешил сохранить авторизацию.') }
      this.token = token
      this.role = role
      this.user = user
    },
    logout() {
      this.token = null
      this.role = null
      this.user = null
      for (const key of ['auth_token', 'auth_role', 'auth_user']) {
        try { localStorage.removeItem(key) } catch { /* Состояние store уже очищено. */ }
      }
    },
    validateToken() {
      // Как в теории, проверка имитируется на клиенте. Также сверяем роль с демо-токеном.
      return (this.token === 'fake-admin-token' && this.role === 'admin')
        || (this.token === 'fake-user-token' && this.role === 'user')
    },
  },
})
