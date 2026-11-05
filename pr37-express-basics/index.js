const express = require('express')
const path = require('node:path')

// Отдельная функция позволяет тестам создать приложение со своим сборщиком логов.
function createApp(log = console.log) {
  const app = express()

  // Middleware выполняется перед маршрутами. next() передаёт запрос дальше.
  app.use((req, res, next) => {
    log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`)
    next()
  })

  // Преобразуем JSON-тело POST-запроса в req.body до его использования в маршрутах.
  app.use(express.json())
  app.get('/', (req, res) => res.send('Привет, Express!'))

  app.get('/hello/:name', (req, res) => {
    res.json({ message: `Привет, ${req.params.name}!` })
  })
  app.get('/math/add', (req, res) => {
    const a = Number(req.query.a)
    const b = Number(req.query.b)
    if (typeof req.query.a !== 'string' || !req.query.a.trim()
      || typeof req.query.b !== 'string' || !req.query.b.trim()
      || !Number.isFinite(a) || !Number.isFinite(b)) {
      return res.status(400).json({ error: 'Некорректные параметры' })
    }
    res.json({ result: a + b })
  })

  app.post('/users', (req, res) => {
    const name = req.body?.name
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Поле name обязательно' })
    }
    // Как в примере, ID имитируется случайным числом. Базы данных в этой работе нет.
    const user = { id: Math.floor(Math.random() * 1000), name: name.trim() }
    res.status(201).json(user)
  })

  // Вариант 27: возвращаем именно JSON-строку, очищенную только по краям.
  app.post('/trim', (req, res) => {
    if (typeof req.body?.text !== 'string') {
      return res.status(400).json({ error: 'Поле text должно быть строкой' })
    }
    res.json(req.body.text.trim())
  })

  // Абсолютный путь к public не зависит от папки, из которой запущен node.
  app.use(express.static(path.join(__dirname, 'public')))

  // Этот middleware ставим после всех существующих маршрутов.
  app.use((req, res) => res.status(404).json({ error: 'Маршрут не найден' }))

  // Четыре аргумента отличают обработчик ошибок от обычного middleware.
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Некорректный JSON' })
    }
    res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  })
  return app
}

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000
  createApp().listen(PORT, '127.0.0.1', () => console.log(`Сервер запущен на http://localhost:${PORT}`))
}
module.exports = { createApp }
