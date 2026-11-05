<template>
  <header class="site-header">
    <RouterLink class="brand" to="/">Каталог курсов</RouterLink>
    <nav aria-label="Основная навигация">
      <RouterLink to="/courses">Курсы</RouterLink>
      <RouterLink to="/dashboard">Личный кабинет</RouterLink>
      <RouterLink to="/login">Вход</RouterLink>
    </nav>
  </header>
  <main class="container"><slot /></main>
  <footer class="site-footer">Практическая работа №32 · Vue Router</footer>
</template>
