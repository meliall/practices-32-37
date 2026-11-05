// Данные трёх курсов перенесены из примера практики; сервер пока имитируется.
export const courses = [
  {
    id: 1,
    title: 'Основы JavaScript',
    category: 'frontend',
    description: 'Полный курс по основам JS: типы, функции, замыкания, асинхронность.',
    program: ['Переменные и типы', 'Функции и область видимости', 'Асинхронность', 'Модули'],
    reviews: [{ author: 'Alex', text: 'Отличный старт для новичков.', rating: 5 }],
  },
  {
    id: 2,
    title: 'Vue.js для начинающих',
    category: 'frontend',
    description: 'Vue 3, Composition API, компоненты, роутер, базовые запросы.',
    program: ['Компоненты и шаблоны', 'Реактивность', 'Роутер', 'Работа с API'],
    reviews: [{ author: 'Maria', text: 'Очень понятно и много практики.', rating: 4 }],
  },
  {
    id: 3,
    title: 'Node.js и Express',
    category: 'backend',
    description: 'Серверная разработка на Node.js: Express, роуты, middleware, БД.',
    program: ['Основы Node.js', 'Express', 'Работа с БД', 'Аутентификация'],
    reviews: [{ author: 'Ivan', text: 'Хороший курс, но мало примеров с БД.', rating: 4 }],
  },
]
