import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { parse, compileScript } from '@vue/compiler-sfc'
import axios, { AxiosError } from 'axios'

// Выполняем настоящий script setup компонента, без копирования его логики.
// Подменяется только HTTP-адаптер Axios: тесты не обращаются в интернет.
const source = await readFile(new URL('../src/pages/RegistrationPage.vue', import.meta.url), 'utf8')
const { descriptor } = parse(source)
const compiled = compileScript(descriptor, { id: 'registration-tests' }).content
// Node не запускает .vue напрямую. Компилируем script setup в JavaScript,
// заменяем пути импортов на абсолютные и загружаем полученный модуль из строки.
const code = compiled.replace(/from (['"])(vue|axios)\1/g,
  (_, quote, name) => `from ${JSON.stringify(import.meta.resolve(name))}`)
const { default: component } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
const originalAdapter = axios.defaults.adapter
// После каждого теста возвращаем исходный способ выполнения запросов Axios,
// чтобы подмена из одного сценария не влияла на следующий.
afterEach(() => { axios.defaults.adapter = originalAdapter })

// Каждый тест получает отдельное состояние формы, как при новом открытии страницы.
function createForm() {
  return component.setup({}, { expose() {} })
}

function fillValid(page) {
  // Корректные учебные данные. Пробелы в имени и email проверяют работу trim().
  Object.assign(page.form, {
    name: '  Анна  ', email: '  anna@example.com  ',
    password: 'Vue2026!', confirmPassword: 'Vue2026!',
  })
}

function response(config) {
  // Учебный успешный HTTP-ответ для тестов; наружу запрос не отправляется.
  return { data: { id: 11 }, status: 201, statusText: 'Created', headers: {}, config }
}

test('Нет ошибок до взаимодействия; blur проверяет поле, ввод исправляет ошибку', () => {
  const page = createForm()
  assert.ok(Object.values(page.errors).every(value => value === null))
  page.handleBlur('name')
  assert.ok(page.errors.name)
  page.form.name = 'Анна'
  page.handleInput('name')
  assert.equal(page.errors.name, null)
})

test('Имя из пробелов и некорректный email не принимаются', () => {
  const page = createForm()
  fillValid(page)
  page.form.name = '   '
  page.form.email = 'anna@'
  assert.equal(page.validate(), false)
  assert.ok(page.errors.name)
  assert.ok(page.errors.email)
})

// Каждый пароль нарушает отдельное требование: так проверяем все условия сложности.
for (const [reason, password] of [
  ['меньше 8 символов', 'Ab1!xyz'],
  ['нет строчной буквы', 'ABCDEF1!'],
  ['нет прописной буквы', 'abcdef1!'],
  ['нет цифры', 'Abcdefg!'],
  ['нет специального символа', 'Abcdef12'],
  ['пробел не заменяет специальный символ', 'Abcdef1 '],
]) {
  test(`Невалидный пароль: ${reason}`, () => {
    const page = createForm()
    fillValid(page)
    page.form.password = password
    page.form.confirmPassword = password
    assert.equal(page.validate(), false)
    assert.ok(page.errors.password)
    assert.equal(page.errors.confirmPassword, null)
  })
}

test('Пароли длиной ровно 8 символов с латинскими и русскими буквами принимаются', () => {
  for (const password of ['Vue2026!', 'Пароль1!']) {
    const page = createForm()
    fillValid(page)
    page.form.password = password
    page.form.confirmPassword = password
    assert.equal(page.validate(), true)
  }
})

test('Пустое и несовпадающее подтверждение отклоняется', () => {
  const page = createForm()
  fillValid(page)
  page.form.confirmPassword = ''
  assert.equal(page.validate(), false)
  assert.ok(page.errors.confirmPassword)
  page.form.confirmPassword = 'Другой1!'
  page.handleInput('confirmPassword')
  assert.ok(page.errors.confirmPassword)
})

test('Изменение пароля перепроверяет подтверждение без отправки формы', () => {
  const page = createForm()
  fillValid(page)
  page.handleBlur('confirmPassword')
  assert.equal(page.errors.confirmPassword, null)
  page.form.password = 'Другой1!'
  page.handleInput('password')
  assert.ok(page.errors.confirmPassword)
  page.form.confirmPassword = 'Другой1!'
  page.handleInput('confirmPassword')
  assert.equal(page.errors.confirmPassword, null)
})

test('Невалидная форма не отправляет HTTP-запрос', async () => {
  let requests = 0
  axios.defaults.adapter = async config => { requests++; return response(config) }
  const page = createForm()
  await page.handleSubmit()
  assert.equal(requests, 0)
  assert.equal(page.isLoading.value, false)
  assert.ok(Object.values(page.errors).every(Boolean))
})

test('Axios отправляет POST с обрезанными пробелами имени и email; повторный клик не дублирует запрос', async () => {
  let sent
  let requests = 0
  let finish
  // Удерживаем ответ до finish(), чтобы проверить состояние во время запроса
  // и убедиться, что повторный вызов отправки не создаёт ещё один запрос.
  axios.defaults.adapter = config => {
    requests++
    sent = config
    return new Promise(resolve => { finish = () => resolve(response(config)) })
  }
  const page = createForm()
  fillValid(page)
  const pending = page.handleSubmit()
  assert.equal(page.isLoading.value, true)
  page.handleSubmit()
  assert.equal(requests, 1)
  assert.equal(sent.method, 'post')
  assert.equal(sent.url, 'https://jsonplaceholder.typicode.com/users')
  assert.deepEqual(JSON.parse(sent.data), {
    name: 'Анна', email: 'anna@example.com', password: 'Vue2026!', confirmPassword: 'Vue2026!',
  })
  finish()
  await pending
  assert.equal(page.isLoading.value, false)
  assert.match(page.successMessage.value, /успешно/)
  assert.equal(page.generalError.value, null)
})

// Воспроизводим разные причины отказа сервера/сети без зависимости от интернета.
// После каждого отказа проверяем, что можно повторить запрос и получить успех.
for (const [reason, makeError, expected] of [
  ['ответ сервера 500', config => new AxiosError('Server error', 'ERR_BAD_RESPONSE', config, {}, { ...response(config), status: 500 }), /Ошибка сервера \(500\)/],
  ['нет ответа', config => new AxiosError('Network error', 'ERR_NETWORK', config, {}), /Сетевая ошибка/],
  ['тайм-аут', config => new AxiosError('Timeout', 'ECONNABORTED', config, {}), /время ожидания истекло/],
  ['другая ошибка', () => new Error('Unexpected error'), /Не удалось отправить форму/],
]) {
  test(`Ошибка Axios: ${reason}; повторная попытка доступна`, async () => {
    axios.defaults.adapter = async config => { throw makeError(config) }
    const page = createForm()
    fillValid(page)
    await page.handleSubmit()
    assert.match(page.generalError.value, expected)
    assert.equal(page.successMessage.value, '')
    assert.equal(page.isLoading.value, false)
    axios.defaults.adapter = async config => response(config)
    await page.handleSubmit()
    assert.equal(page.generalError.value, null)
    assert.match(page.successMessage.value, /успешно/)
  })
}
