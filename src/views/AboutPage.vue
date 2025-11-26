<script setup lang="ts">
import aboutImage from '../assets/about.jpg'
</script>

<template>
  <section class="page">
    <img :src="aboutImage" alt="About" class="page__image" />
    <h2 class="page__title">Обо мне</h2>
    <p class="page__subtitle">
      Краткий текст о фотографе/ретушёре, подходе к работе и опыте. Здесь можно рассказать о стиле,
      ценностях и том, как строится взаимодействие с клиентом.
    </p>
  </section>
</template>

<style scoped>
.page__title {
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0 0 0.75rem;
}

.page__subtitle {
  margin: 0;
  color: #666;
  max-width: 36rem;
}

.page__image {
  max-width: 400px;
  height: auto;
  object-fit: cover;
  padding-bottom: 20px;
}
</style>
