<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGalleryStore } from '../stores/gallery'

const galleryStore = useGalleryStore()
const { photos } = storeToRefs(galleryStore)
</script>

<template>
  <section class="page">
    <h2 class="page__title">Галерея</h2>
    <p class="page__subtitle">Подборка работ с акцентом на свет, цвет и аккуратную ретушь.</p>

    <div v-if="!photos.length" class="page__empty">
      Пока здесь нет фотографий. Владелец сайта может загрузить их на скрытой странице
      администратора.
    </div>

    <div v-else class="gallery-grid">
      <article v-for="photo in photos" :key="photo.id" class="gallery-grid__item">
        <div class="gallery-grid__image-wrapper">
          <img
            :src="photo.dataUrl"
            :alt="photo.title || 'Фотография из портфолио'"
            class="gallery-grid__image"
          />
          <div class="gallery-grid__overlay" aria-hidden="true"></div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page__title {
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0;
}

.page__subtitle {
  margin: 0 0 1.5rem;
  color: #666;
  max-width: 32rem;
}

.page__empty {
  padding: 2rem;
  border-radius: 0.75rem;
  background: #fafafa;
  color: #777;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.gallery-grid__image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  background: #f2f2f2;
}

.gallery-grid__image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.gallery-grid__overlay {
  position: absolute;
  inset: 0;
  background: transparent;
}
</style>
