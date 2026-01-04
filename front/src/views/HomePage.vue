<script setup lang="ts"></script>

<template>
  <section class="home">
    <div class="home__image-wrapper">
      <!-- Здесь можно заменить src на реальное изображение из /public -->
      <img
        src="https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1200"
        alt="Пример минималистичной архитектурной фотографии"
        class="home__image"
      />
      <div class="home__image-overlay" aria-hidden="true"></div>
    </div>
  </section>
</template>

<style scoped>
.home {
  display: flex;
  justify-content: center;
}

.home__image-wrapper {
  position: relative;
  max-width: 720px;
  width: 100%;
  overflow: hidden;
}

.home__image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.home__image-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
}
</style>
