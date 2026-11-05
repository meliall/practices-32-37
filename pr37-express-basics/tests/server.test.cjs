const { beforeEach, test } = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')
const { createApp } = require('../index')
let app, logs
beforeEach(() => { logs = []; app = createApp(line => logs.push(line)) })
test('Базовый маршрут открывается', async () => { await request(app).get('/').expect(200, 'Привет, Express!') })
test('Параметр имени возвращается в JSON', async () => { await request(app).get('/hello/Anna').expect(200, { message: 'Привет, Anna!' }) })
test('Query-параметры складываются как числа', async () => { await request(app).get('/math/add?a=1&b=2').expect(200, { result: 3 }) })
test('Пропущенные и неверные числа отклоняются', async () => {
  for (const url of ['/math/add?a=no&b=2', '/math/add?a=&b=2', '/math/add?a=1']) await request(app).get(url).expect(400)
})
test('Middleware записывает время, метод и адрес', async () => {
  await request(app).get('/hello/Anna')
  assert.match(logs[0], /^\d{4}-\d{2}-\d{2}T.* GET \/hello\/Anna$/)
})
test('POST /users добавляет числовой id и возвращает 201', async () => {
  const result = await request(app).post('/users').send({ name: 'Анна' }).expect(201)
  assert.equal(result.body.name, 'Анна'); assert.ok(Number.isInteger(result.body.id))
})
test('Пустое имя отклоняется', async () => { await request(app).post('/users').send({ name: ' ' }).expect(400) })
test('Статический HTML доступен из public', async () => { await request(app).get('/info.html').expect(200).expect(/Статический файл Express/) })
test('Неизвестный маршрут возвращает JSON и 404', async () => { await request(app).get('/missing').expect(404, { error: 'Маршрут не найден' }) })
test('Вариант 27 убирает только крайние пробелы', async () => {
  const result = await request(app).post('/trim').send({ text: '  abc def  ' }).expect(200)
  assert.equal(result.body, 'abc def')
})
test('Вариант 27 принимает пустую строку и отклоняет нестроковые данные', async () => {
  const result = await request(app).post('/trim').send({ text: '   ' }).expect(200)
  assert.equal(result.body, '')
  await request(app).post('/trim').send({ text: 12 }).expect(400)
})
test('Ошибка разбора JSON обрабатывается отдельным middleware', async () => {
  await request(app).post('/users').set('Content-Type', 'application/json').send('{bad').expect(400, { error: 'Некорректный JSON' })
})
