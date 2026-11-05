# Практическая работа 36 — установка Express

Подготовка выполнена по теории: `npm init -y`, `npm install express`.

После распаковки: `npm install`, затем `npm start` (или `node server.js`).
По умолчанию сервер слушает `http://localhost:3000`.

Маршруты из примеров:
- GET `/` → `Hello, World!`
- POST `/submit` → `Форма отправлена!`
- PUT `/update` → `Данные обновлены!`
- DELETE `/delete` → `Данные удалены!`
- GET `/users/14` → `Профиль пользователя с ID: 14`

`require('express')` загружает пакет, `express()` создаёт приложение,
`app.listen` запускает приём HTTP-запросов. Данные в этой работе не сохраняются.
Проверка всех пяти маршрутов: `npm test`.
