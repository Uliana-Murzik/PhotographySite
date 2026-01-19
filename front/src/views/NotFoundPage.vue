<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="page not-found">
    <div class="not-found__content">
      <img src="/notfound.jpg" alt="Ничего не найдено" class="not-found__image" />
      <h1 class="not-found__title">ничево ненайдено...</h1>
      <RouterLink to="/" class="not-found__link">Вернуться на главную</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found__content {
  text-align: center;
  max-width: 500px;
}

.not-found__image {
  width: 100%;
  max-width: 600px;
  height: auto;
  margin: 0 auto 22px;
  display: block;
  border-radius: 16px;
}

.not-found__title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px;
}

.not-found__link {
  display: inline-block;
  padding: 12px 32px;
  background: #000000;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .not-found__title {
    font-size: 24px;
  }

  .not-found__image {
    max-width: 300px;
  }
}
</style>
