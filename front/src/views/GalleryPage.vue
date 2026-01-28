<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalleryStore } from '../stores/gallery'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const galleryStore = useGalleryStore()
const { albumsWithImages, imagesByAlbum, images, isLoading, error } = storeToRefs(galleryStore)

// Активный альбом (null = все активны)
const activeAlbumId = ref<number | null>(null)

// Общее количество фото
const totalPhotos = computed(() => images.value.length)

// Все изображения для отображения в сетке
const allImages = computed(() => {
  const result: Array<{
    id: number
    url: string
    alt: string
    albumId: number
    width: number
    height: number
  }> = []

  albumsWithImages.value.forEach((album) => {
    const albumImages = imagesByAlbum.value[album.id] || []
    albumImages.forEach((img) => {
      result.push({
        id: img.id,
        url: `${API_BASE}${img.webUrl}`,
        alt: img.description || img.originalName || `Фото из ${album.name}`,
        albumId: album.id,
        width: img.width || 800,
        height: img.height || 600
      })
    })
  })

  return result
})

// Выбор альбома
const selectAlbum = (albumId: number) => {
  activeAlbumId.value = activeAlbumId.value === albumId ? null : albumId
}

// Проверка активности изображения
const isImageActive = (albumId: number) => {
  return activeAlbumId.value === null || activeAlbumId.value === albumId
}

// Canvas refs
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())

// Регистрация canvas ref
const setCanvasRef = (el: HTMLCanvasElement | null, id: number) => {
  if (el) {
    canvasRefs.value.set(id, el)
  }
}

const drawImageOnCanvas = (canvas: HTMLCanvasElement, imgUrl: string) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    const container = canvas.parentElement
    if (!container) return

    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

    ctx.scale(dpr, dpr)

    const imgAspect = img.naturalWidth / img.naturalHeight
    const containerAspect = containerWidth / containerHeight

    let drawWidth, drawHeight, drawX, drawY

    if (imgAspect > containerAspect) {
      // Изображение шире контейнера
      drawHeight = containerHeight
      drawWidth = containerHeight * imgAspect
      drawX = (containerWidth - drawWidth) / 2
      drawY = 0
    } else {
      // Изображение выше контейнера
      drawWidth = containerWidth
      drawHeight = containerWidth / imgAspect
      drawX = 0
      drawY = (containerHeight - drawHeight) / 2
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
  }

  img.src = imgUrl
}

// Перерисовка всех canvas при изменении изображений
const redrawAllCanvases = async () => {
  await nextTick()
  
  allImages.value.forEach((img) => {
    const canvas = canvasRefs.value.get(img.id)
    if (canvas) {
      drawImageOnCanvas(canvas, img.url)
    }
  })
}

// Установка первого альбома как активного
watch(albumsWithImages, (albums) => {
  if (albums.length && activeAlbumId.value === null) {
    activeAlbumId.value = albums[0].id
  }
}, { immediate: true })

// Перерисовка при загрузке данных
watch(allImages, () => {
  redrawAllCanvases()
}, { deep: true })

onMounted(() => {
  galleryStore.fetchAll()
})
</script>

<template>
  <section class="page">
    <div v-if="isLoading" class="page__loading">
      <span class="page__spinner"></span>
      Загрузка...
    </div>

    <div v-else-if="error" class="page__error">
      {{ error }}
    </div>

    <div v-else-if="!allImages.length" class="page__empty">Пока здесь нет фотографий</div>

    <div v-else class="gallery">
      <div class="gallery__grid">
        <div 
          v-for="img in allImages" 
          :key="img.id"
          class="gallery__item"
          :class="{ 
            'gallery__item--active': isImageActive(img.albumId),
            'gallery__item--vertical': img.height > img.width
          }"
        >
          <div class="gallery__canvas-wrap">
            <canvas 
              :ref="(el) => setCanvasRef(el as HTMLCanvasElement, img.id)"
              class="gallery__canvas"
            ></canvas>
          </div>
        </div>
      </div>

      <div class="gallery__categories">
        <button
          v-for="album in albumsWithImages"
          :key="album.id"
          class="gallery__category"
          :class="{ 'gallery__category--active': activeAlbumId === album.id }"
          @click="selectAlbum(album.id)"
        >
          <span class="gallery__category-name">{{ album.name }}</span>
          <span class="gallery__category-count">( {{ (imagesByAlbum[album.id] || []).length }} )</span>
        </button>
      </div>

      <div class="gallery__total">/{{ totalPhotos }}Photos</div>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* Gallery */
.gallery {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 120px;
  grid-auto-flow: dense;
  gap: 10px;
}

.gallery__item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f0f0f0;
  transition: opacity 0.4s ease, filter 0.4s ease;
}

/* Вертикальные изображения занимают 2 ряда */
.gallery__item--vertical {
  grid-row: span 2;
}

/* Неактивные изображения */
.gallery__item:not(.gallery__item--active) {
  opacity: 0.2;
  filter: grayscale(100%);
}

.gallery__canvas-wrap {
  width: 100%;
  height: 100%;
}

.gallery__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Categories */
.gallery__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 8px;
}

.gallery__category {
  background: none;
  border: none;
  padding: 4px 0;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 6px;
  transition: opacity 0.3s ease;
  border-bottom: 2px solid transparent;
}

.gallery__category:not(.gallery__category--active) {
  opacity: 0.4;
}

.gallery__category:hover {
  opacity: 1;
}

.gallery__category--active {
  border-bottom-color: #222;
}

.gallery__category-name {
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 500;
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  color: #222;
  letter-spacing: -0.02em;
}

.gallery__category-count {
  font-size: 13px;
  font-weight: 400;
  color: #222;
  opacity: 0.6;
}

.gallery__total {
  font-size: 13px;
  color: #222;
  opacity: 0.5;
  font-style: italic;
}

/* Responsive */
@media (max-width: 1200px) {
  .gallery__grid {
    grid-auto-rows: 100px;
  }
}

@media (max-width: 1024px) {
  .gallery__grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 110px;
  }
}

@media (max-width: 768px) {
  .gallery__grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 100px;
    gap: 8px;
  }
  
  .gallery__item {
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .gallery__grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 90px;
    gap: 6px;
  }
  
  .gallery__category-name {
    font-size: 18px;
  }
}
</style>
