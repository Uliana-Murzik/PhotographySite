<script setup lang="ts"></script>

<template>
  <section class="page">
    <h2 class="page__title">Услуги</h2>
    <p class="page__subtitle">
      Здесь можно перечислить основные пакеты услуг: ретушь для фотографов, для брендов, подготовка
      серий к публикации и т.д.
    </p>

    <ul class="services-list">
      <li class="services-list__item">
        <h3 class="services-list__title">Ретушь портретов</h3>
        <p class="services-list__text">
          Аккуратная работа с кожей, светом и цветом без эффекта «пластика».
        </p>
      </li>
      <li class="services-list__item">
        <h3 class="services-list__title">Серии для брендов</h3>
        <p class="services-list__text">
          Единый стиль для лукбуков, кампейнов и контента в соцсетях.
        </p>
      </li>
      <li class="services-list__item">
        <h3 class="services-list__title">Подготовка к печати</h3>
        <p class="services-list__text">Коррекция под тип носителя и печатные требования.</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.page__title {
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0 0 0.75rem;
}

.page__subtitle {
  margin: 0 0 1.5rem;
  color: #666;
  max-width: 34rem;
}

.services-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.services-list__item {
  padding: 1.25rem 1.25rem 1.5rem;
  border-radius: 0.75rem;
  background: #fafafa;
}

.services-list__title {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.services-list__text {
  margin: 0;
  font-size: 0.95rem;
  color: #555;
}
</style>
