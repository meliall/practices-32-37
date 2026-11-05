// require загружает Express из установленного пакета node_modules.
const express = require('express')
const app = express()
const port = Number(process.env.PORT) || 3000

// Первый пример из теории: ответ на открытие главной страницы.
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Один и тот же сервер обрабатывает разные HTTP-методы и адреса.
app.post('/submit', (req, res) => res.send('Форма отправлена!'))
app.put('/update', (req, res) => res.send('Данные обновлены!'))
app.delete('/delete', (req, res) => res.send('Данные удалены!'))

// Двоеточие объявляет параметр: в /users/14 значение req.params.id равно "14".
app.get('/users/:id', (req, res) => {
  res.send(`Профиль пользователя с ID: ${req.params.id}`)
})

// При импорте в тестах сервер не запускается повторно.
if (require.main === module) {
  app.listen(port, '127.0.0.1', () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
  })
}
module.exports = app
