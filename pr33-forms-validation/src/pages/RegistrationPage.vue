<script setup>
// script setup позволяет использовать объявленные здесь переменные и функции в template.
// ref хранит отдельное значение, reactive делает свойства объекта реактивными:
// при их изменении Vue автоматически обновляет соответствующие элементы страницы.
import { reactive, ref } from 'vue'
// Axios выполняет HTTP-запрос к тестовому серверу из задания.
import axios from 'axios'

// Пока запрос выполняется, isLoading блокирует форму и меняет текст кнопки.
// В JavaScript значение ref читается и меняется через .value.
// В template Vue раскрывает ref автоматически, поэтому .value там не пишем.
const isLoading = ref(false)
// Сообщение об успешном ответе сервера.
const successMessage = ref('')
// Общая ошибка отправки. Ошибки отдельных полей хранятся отдельно, в errors.
const generalError = ref(null)
// v-model связывает каждое поле ввода с соответствующим свойством form.
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })
// null означает, что у поля сейчас нет ошибки; строка содержит текст ошибки.
const errors = reactive({ name: null, email: null, password: null, confirmPassword: null })
// touched запоминает, какие поля уже проверяли. Благодаря этому при открытии
// формы пользователь не видит ошибки во всех ещё не заполненных полях.
const touched = reactive({ name: false, email: false, password: false, confirmPassword: false })

// Проверяем одно поле. field — его имя: name, email, password или confirmPassword.
function validateField(field) {
  // Перед повторной проверкой удаляем старую ошибку этого поля.
  errors[field] = null
  // trim() убирает пробелы по краям, поэтому имя из одних пробелов не принимается.
  if (field === 'name' && form.name.trim().length < 2) {
    errors.name = 'Имя должно быть не короче 2 символов.'
  }
  // Упрощённый учебный шаблон email: текст без пробелов и @, затем @,
  // домен, точка и зона. ^ и $ требуют совпадения со всей строкой.
  if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Введите корректный email.'
  }
  if (field === 'password') {
    // Проверяем требования по очереди и показываем первую найденную проблему.
    // test() проверяет совпадение с регулярным выражением, ! отрицает результат.
    // \p{Ll} — строчная буква, \p{Lu} — прописная; флаг u включает Unicode.
    // Поэтому проверка понимает и латинские, и русские буквы.
    // \d ищет цифру, [^\p{L}\p{N}\s] — символ, который не является
    // буквой, числом или пробельным символом: например, !, @ или #.
    if (form.password.length < 8) errors.password = 'Пароль должен быть не короче 8 символов.'
    else if (!/\p{Ll}/u.test(form.password)) errors.password = 'Добавьте строчную букву.'
    else if (!/\p{Lu}/u.test(form.password)) errors.password = 'Добавьте прописную букву.'
    else if (!/\d/.test(form.password)) errors.password = 'Добавьте цифру.'
    else if (!/[^\p{L}\p{N}\s]/u.test(form.password)) errors.password = 'Добавьте специальный символ, например !, @ или #.'
  }
  if (field === 'confirmPassword') {
    // Сначала проверяем заполненность, затем точное совпадение с паролем.
    if (!form.confirmPassword) errors.confirmPassword = 'Подтвердите пароль.'
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Пароли не совпадают.'
  }
}

// Полная проверка перед отправкой: пользователь мог пропустить некоторые поля.
function validate() {
  // Object.keys(errors) возвращает массив имён всех четырёх полей.
  Object.keys(errors).forEach(field => {
    touched[field] = true
    validateField(field)
  })
  // every() вернёт true, только если у каждого поля нет сообщения об ошибке.
  return Object.values(errors).every(error => !error)
}

// @blur вызывается, когда пользователь уводит фокус из поля.
function handleBlur(field) {
  touched[field] = true
  validateField(field)
}

// @input вызывается при изменении значения. v-model уже обновляет свойство form.
function handleInput(field) {
  // После редактирования предыдущий результат отправки уже не относится
  // к текущим данным, поэтому убираем старое сообщение об успехе или ошибке.
  successMessage.value = ''
  generalError.value = null
  // Уже проверенное поле перепроверяется сразу при исправлении ввода.
  if (touched[field]) validateField(field)
  // Изменение исходного пароля также проверяет уже введённое подтверждение.
  if (field === 'password' && touched.confirmPassword) validateField('confirmPassword')
}

// @submit.prevent вызывает эту функцию и отменяет обычную отправку HTML-формы.
// Страница остаётся открытой; данные отправляем отдельным запросом Axios.
function handleSubmit() {
  // Дополнительная защита от повторного запроса, пока первый ещё не завершён.
  if (isLoading.value) return
  successMessage.value = ''
  generalError.value = null
  // Если есть ошибки полей, выходим до обращения к серверу.
  if (!validate()) return

  isLoading.value = true
  // payload — объект с данными запроса. Имя и email очищаем по краям,
  // пароль передаём точно как введён: его символы изменять нельзя.
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    password: form.password,
    // Как в учебном примере. На реальном бэкенде обычно достаточно password.
    confirmPassword: form.confirmPassword,
  }

  // POST отправляет payload на адрес из учебного примера.
  // Axios сериализует обычный объект в JSON. timeout: 10000 — ожидание до 10 секунд.
  // Возвращаем Promise, чтобы вызывающий код (в том числе тесты) мог дождаться результата.
  return axios.post('https://jsonplaceholder.typicode.com/users', payload, { timeout: 10000 })
    .then(() => {
      // Эта ветка выполняется, когда сервер успешно ответил.
      successMessage.value = 'Регистрация успешно отправлена (демо).'
    })
    .catch(error => {
      if (error.response) {
        // Сервер ответил, но HTTP-статус означает ошибку, например 400 или 500.
        generalError.value = `Ошибка сервера (${error.response.status}). Попробуйте позже.`
      } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        // Запрос не успел завершиться за отведённое время.
        generalError.value = 'Сетевая ошибка: время ожидания истекло. Попробуйте ещё раз.'
      } else if (error.request || error.code === 'ERR_NETWORK') {
        // Успешного ответа нет: например, возникла проблема с сетью или доступом к серверу.
        generalError.value = 'Сетевая ошибка: сервер не ответил. Проверьте подключение и повторите попытку.'
      } else {
        // Остальные ошибки, например ошибка подготовки запроса.
        generalError.value = 'Не удалось отправить форму. Попробуйте ещё раз.'
      }
    })
    .finally(() => {
      // Выполняется и после успеха, и после ошибки: возвращаем возможность ввода и отправки.
      isLoading.value = false
    })
}
</script>

<template>
  <main class="form-page">
    <header class="page-header">
      <p class="eyebrow">Практическая работа №33</p>
      <p class="page-topic">Формы и валидация · Vue</p>
    </header>

    <section class="registration-card" aria-labelledby="registration-title">
      <h1 id="registration-title">Регистрация</h1>
      <p class="intro">Заполните форму, чтобы отправить учебную регистрацию.</p>

      <!-- novalidate отключает встроенные подсказки браузера: ошибки показываем сами.
           .prevent отменяет перезагрузку страницы при submit, aria-busy сообщает о загрузке. -->
      <form class="registration-form" novalidate :aria-busy="isLoading" @submit.prevent="handleSubmit">
        <!-- disabled у fieldset блокирует сразу все поля и кнопку на время запроса. -->
        <fieldset :disabled="isLoading">
          <legend class="visually-hidden">Данные для регистрации</legend>

          <!-- Одинаковый принцип у всех полей: v-model хранит значение, blur/input запускают
               проверку, :class подсвечивает ошибку, v-if показывает её текст. -->
          <div class="form-group">
            <label for="name">Имя</label>
            <input id="name" v-model="form.name" type="text" autocomplete="name" required
              @blur="handleBlur('name')" @input="handleInput('name')"
              class="form-input" :class="{ 'input-error': errors.name }"
              :aria-invalid="Boolean(errors.name)" :aria-describedby="errors.name ? 'name-error' : undefined" />
            <span v-if="errors.name" id="name-error" class="error-message" aria-live="polite">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" autocomplete="email" required
              @blur="handleBlur('email')" @input="handleInput('email')"
              class="form-input" :class="{ 'input-error': errors.email }"
              :aria-invalid="Boolean(errors.email)" :aria-describedby="errors.email ? 'email-error' : undefined" />
            <span v-if="errors.email" id="email-error" class="error-message" aria-live="polite">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input id="password" v-model="form.password" type="password" autocomplete="new-password" minlength="8" required
              @blur="handleBlur('password')" @input="handleInput('password')"
              class="form-input" :class="{ 'input-error': errors.password }"
              :aria-invalid="Boolean(errors.password)"
              :aria-describedby="errors.password ? 'password-hint password-error' : 'password-hint'" />
            <p id="password-hint" class="field-hint">Не менее 8 символов: строчные и прописные буквы, цифра и спецсимвол.</p>
            <span v-if="errors.password" id="password-error" class="error-message" aria-live="polite">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Подтверждение пароля</label>
            <input id="confirmPassword" v-model="form.confirmPassword" type="password" autocomplete="new-password" required
              @blur="handleBlur('confirmPassword')" @input="handleInput('confirmPassword')"
              class="form-input" :class="{ 'input-error': errors.confirmPassword }"
              :aria-invalid="Boolean(errors.confirmPassword)"
              :aria-describedby="errors.confirmPassword ? 'confirm-error' : undefined" />
            <span v-if="errors.confirmPassword" id="confirm-error" class="error-message" aria-live="polite">{{ errors.confirmPassword }}</span>
          </div>

          <!-- Общая ошибка запроса выводится отдельно от ошибок заполнения полей. -->
          <p v-if="generalError" class="general-error" role="alert">{{ generalError }}</p>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner" aria-hidden="true"></span>
            {{ isLoading ? 'Отправка…' : 'Зарегистрироваться' }}
          </button>
        </fieldset>
      </form>

      <!-- Сообщение появляется только после успешного ответа сервера. -->
      <p v-if="successMessage" class="success-message" role="status">{{ successMessage }}</p>
      <p class="demo-note">Учебная форма. Используйте вымышленные данные.</p>
    </section>
  </main>
</template>
