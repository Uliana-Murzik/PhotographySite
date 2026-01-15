<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalleryStore } from '../stores/gallery'
import ProtectedImage from '../components/ProtectedImage.vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const galleryStore = useGalleryStore()
const { albumsWithImages, imagesByAlbum, isLoading, error } = storeToRefs(galleryStore)

onMounted(() => {
  galleryStore.fetchAll()
})
</script>

<template>
  <section class="page">
    <h2 class="page__title">Галерея</h2>
    <p class="page__subtitle">Подборка работ с акцентом на свет, цвет и аккуратную ретушь.</p>

    <!-- Loading state -->
    <div v-if="isLoading" class="page__loading">
      <span class="page__spinner"></span>
      Загрузка...
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="page__error">
      {{ error }}
    </div>

    <!-- Empty state -->
    <div v-else-if="!albumsWithImages.length" class="page__empty">Пока здесь нет фотографий</div>

    <!-- Albums with images -->
    <div v-else class="albums">
      <article v-for="album in albumsWithImages" :key="album.id" class="album">
        <header class="album__header">
          <h3 class="album__name">{{ album.name }}</h3>
          <p v-if="album.description" class="album__description">{{ album.description }}</p>
        </header>

        <div class="gallery-grid">
          <div v-for="photo in imagesByAlbum[album.id]" :key="photo.id" class="gallery-grid__item">
            <div class="gallery-grid__image-wrapper">
              <ProtectedImage
                :src="`${API_BASE}${photo.webUrl}`"
                :alt="photo.description || photo.originalName || 'Фотография из портфолио'"
                fit="contain"
                :auto-height="true"
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page__title {
  font-size: 26px;
  font-weight: 500;
  margin: 0;
}

.page__subtitle {
  margin: 0 0 24px;
  color: #666;
  max-width: 512px;
}

.page__loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px;
  color: #666;
}

.page__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.page__error {
  padding: 32px;
  border-radius: 12px;
  background: #fee;
  color: #c0392b;
}

.page__empty {
  padding: 32px;
  border-radius: 12px;
  background: #fafafa;
  color: #777;
}

.albums {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.album__header {
  margin-bottom: 20px;
}

.album__name {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 6px;
  color: #222;
}

.album__description {
  margin: 0;
  font-size: 15px;
  color: #666;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 32px;
}

.gallery-grid__item {
  width: 100%;
}

.gallery-grid__image-wrapper {
  position: relative;
  overflow: visible;
  border-radius: 12px;
  background: transparent;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Защищённые изображения через canvas */
</style>
