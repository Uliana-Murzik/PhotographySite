<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
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
    albumName: string
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
        albumName: album.name,
        width: img.width || 800,
        height: img.height || 600
      })
    })
  })

  return result
})

const scrollToAlbum = async (albumId: number | null) => {
  await nextTick()
  const container = galleryContainerRef.value
  if (!container) return

  const firstAlbumId = albumsWithImages.value[0]?.id
  if (albumId === null || albumId === firstAlbumId) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const targets = Array.from(
    container.querySelectorAll<HTMLElement>(`.gallery__item[data-album-id="${albumId}"]`)
  )
  if (!targets.length) return

  const containerRect = container.getBoundingClientRect()
  const sortedTargets = targets
    .map((el) => {
      const rect = el.getBoundingClientRect()
      const top = rect.top - containerRect.top + container.scrollTop
      const left = rect.left - containerRect.left + container.scrollLeft
      return { el, top, left }
    })
    .sort((a, b) => {
      if (Math.abs(a.top - b.top) > 1) return a.top - b.top
      return a.left - b.left
    })

  container.scrollTo({ top: sortedTargets[0].top, behavior: 'smooth' })
}

// Выбор альбома
const selectAlbum = (albumId: number) => {
  const nextSelection = activeAlbumId.value === albumId ? null : albumId
  activeAlbumId.value = nextSelection
  scrollToAlbum(nextSelection)
}

// Проверка активности изображения
const isImageActive = (albumId: number) => {
  return activeAlbumId.value === null || activeAlbumId.value === albumId
}

// ============ VIEWER STATE ============
const viewerOpen = ref(false)
const viewerAlbumId = ref<number | null>(null)
const viewerCurrentIndex = ref(0)

// Изображения текущего альбома для просмотра
const viewerImages = computed(() => {
  if (!viewerAlbumId.value) return []
  return allImages.value.filter(img => img.albumId === viewerAlbumId.value)
})

// Текущее изображение
const viewerCurrentImage = computed(() => {
  return viewerImages.value[viewerCurrentIndex.value] || null
})

// Название альбома
const viewerAlbumName = computed(() => {
  const album = albumsWithImages.value.find(a => a.id === viewerAlbumId.value)
  return album?.name || ''
})

// Открыть просмотр
const openViewer = (img: typeof allImages.value[0]) => {
  viewerAlbumId.value = img.albumId
  const albumImages = viewerImages.value
  const index = albumImages.findIndex(i => i.id === img.id)
  viewerCurrentIndex.value = index >= 0 ? index : 0
  viewerOpen.value = true
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    drawViewerCanvases()
  })
}

// Закрыть просмотр
const closeViewer = () => {
  viewerOpen.value = false
  document.body.style.overflow = ''
}

// Навигация
const goToImage = (index: number) => {
  viewerCurrentIndex.value = index
  nextTick(() => drawMainCanvas())
}

const nextImage = () => {
  if (viewerCurrentIndex.value < viewerImages.value.length - 1) {
    viewerCurrentIndex.value++
    nextTick(() => drawMainCanvas())
  }
}

const prevImage = () => {
  if (viewerCurrentIndex.value > 0) {
    viewerCurrentIndex.value--
    nextTick(() => drawMainCanvas())
  }
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!viewerOpen.value) return
  
  if (e.key === 'Escape') closeViewer()
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextImage()
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevImage()
}

// ============ CANVAS DRAWING ============
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())
const mainCanvasRef = ref<HTMLCanvasElement | null>(null)
const thumbCanvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())
const galleryContainerRef = ref<HTMLDivElement | null>(null)
const initialScrollDone = ref(false)

const setCanvasRef = (el: HTMLCanvasElement | null, id: number) => {
  if (el) canvasRefs.value.set(id, el)
}

const setThumbCanvasRef = (el: HTMLCanvasElement | null, id: number) => {
  if (el) thumbCanvasRefs.value.set(id, el)
}

const drawImageOnCanvas = (canvas: HTMLCanvasElement, imgUrl: string, contain = false) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const img = new Image()
  img.crossOrigin = 'anonymous'
  
  img.onload = () => {
    const container = canvas.parentElement
    if (!container) return

    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    if (containerWidth === 0 || containerHeight === 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

    ctx.scale(dpr, dpr)
    
    // Очистить canvas
    ctx.clearRect(0, 0, containerWidth, containerHeight)

    const imgAspect = img.naturalWidth / img.naturalHeight
    const containerAspect = containerWidth / containerHeight

    let drawWidth, drawHeight, drawX, drawY

    if (contain) {
      // object-fit: contain
      if (imgAspect > containerAspect) {
        drawWidth = containerWidth
        drawHeight = containerWidth / imgAspect
        drawX = 0
        drawY = (containerHeight - drawHeight) / 2
      } else {
        drawHeight = containerHeight
        drawWidth = containerHeight * imgAspect
        drawX = (containerWidth - drawWidth) / 2
        drawY = 0
      }
    } else {
      // object-fit: cover
      if (imgAspect > containerAspect) {
        drawHeight = containerHeight
        drawWidth = containerHeight * imgAspect
        drawX = (containerWidth - drawWidth) / 2
        drawY = 0
      } else {
        drawWidth = containerWidth
        drawHeight = containerWidth / imgAspect
        drawX = 0
        drawY = (containerHeight - drawHeight) / 2
      }
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
  }

  img.src = imgUrl
}

// Перерисовка сетки
const redrawAllCanvases = async () => {
  await nextTick()
  allImages.value.forEach((img) => {
    const canvas = canvasRefs.value.get(img.id)
    if (canvas) drawImageOnCanvas(canvas, img.url)
  })
}

// Рисование главного изображения в viewer
const drawMainCanvas = () => {
  if (!mainCanvasRef.value || !viewerCurrentImage.value) return
  drawImageOnCanvas(mainCanvasRef.value, viewerCurrentImage.value.url, true)
}

// Рисование миниатюр в viewer
const drawThumbCanvases = () => {
  viewerImages.value.forEach((img) => {
    const canvas = thumbCanvasRefs.value.get(img.id)
    if (canvas) drawImageOnCanvas(canvas, img.url)
  })
}

// Рисование всех canvas в viewer
const drawViewerCanvases = async () => {
  await nextTick()
  drawMainCanvas()
  drawThumbCanvases()
}

// Установка первого альбома как активного
watch(albumsWithImages, (albums) => {
  if (albums.length && activeAlbumId.value === null) {
    activeAlbumId.value = albums[0].id
    scrollToAlbum(albums[0].id)
  }
}, { immediate: true })

watch(
  [() => allImages.value.length, () => galleryContainerRef.value],
  async ([imagesCount, container]) => {
    if (initialScrollDone.value) return
    if (!container || !imagesCount || !activeAlbumId.value) return
    await nextTick()
    await scrollToAlbum(activeAlbumId.value)
    initialScrollDone.value = true
  },
  { immediate: true }
)

// Перерисовка при загрузке данных
watch(allImages, () => {
  redrawAllCanvases()
}, { deep: true })

// Перерисовка при изменении текущего изображения
watch(viewerCurrentIndex, () => {
  if (viewerOpen.value) drawMainCanvas()
})

onMounted(() => {
  galleryStore.fetchAll()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
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

      <div class="gallery__total">/{{ totalPhotos }} Фото</div>
      <div class="gallery__container" ref="galleryContainerRef">
        <div class="gallery__grid">
        <div 
          v-for="img in allImages" 
          :key="img.id"
          class="gallery__item"
          :class="{ 
            'gallery__item--active': isImageActive(img.albumId),
            'gallery__item--vertical': img.height > img.width
          }"
          :data-album-id="img.albumId"
          @click="openViewer(img)"
        >
          <div class="gallery__canvas-wrap">
            <canvas 
              :ref="(el) => setCanvasRef(el as HTMLCanvasElement, img.id)"
              class="gallery__canvas"
            ></canvas>
          </div>
        </div>
      </div>
      </div>
      

      
    </div>

    <Teleport to="body">
      <div v-if="viewerOpen" class="viewer" @click.self="closeViewer">
        <!-- Левая часть - категория -->
        <div class="viewer__left">
          <div class="viewer__category">
            <span class="viewer__category-label">CATEGORY</span>
            <span class="viewer__category-name">{{ viewerAlbumName }}</span>
          </div>
        </div>

        <div class="viewer__main">
          <div class="viewer__main-canvas-wrap">
            <canvas 
              ref="mainCanvasRef"
              class="viewer__main-canvas"
            ></canvas>
          </div>
          
          <button 
            v-if="viewerCurrentIndex > 0"
            class="viewer__nav viewer__nav--prev" 
            @click="prevImage"
            aria-label="Предыдущее"
          >
            ‹
          </button>
          <button 
            v-if="viewerCurrentIndex < viewerImages.length - 1"
            class="viewer__nav viewer__nav--next" 
            @click="nextImage"
            aria-label="Следующее"
          >
            ›
          </button>
        </div>

        <div class="viewer__thumbs">
          <div 
            v-for="(img, index) in viewerImages" 
            :key="img.id"
            class="viewer__thumb"
            :class="{ 'viewer__thumb--active': index === viewerCurrentIndex }"
            @click="goToImage(index)"
          >
            <div class="viewer__thumb-canvas-wrap">
              <canvas 
                :ref="(el) => setThumbCanvasRef(el as HTMLCanvasElement, img.id)"
                class="viewer__thumb-canvas"
              ></canvas>
            </div>
          </div>
        </div>

        <button class="viewer__close" @click="closeViewer" aria-label="Закрыть">
          ✕
        </button>
      </div>
    </Teleport>
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
  to { transform: rotate(360deg); }
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

.gallery {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.gallery__container {
  height: 70vh;
  overflow:scroll;
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
  cursor: pointer;
  transition: opacity 0.4s ease, filter 0.4s ease, transform 0.2s ease;
}

.gallery__item:hover {
  transform: scale(1.02);
}

.gallery__item--vertical {
  grid-row: span 2;
}

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

.viewer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fafafa;
  display: grid;
  grid-template-columns: 200px 1fr 100px;
  gap: 20px;
  padding: 40px;
}

.viewer__left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.viewer__category {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.viewer__category-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: #888;
  text-transform: uppercase;
}

.viewer__category-name {
  font-size: 18px;
  font-weight: 500;
  color: #222;
}

.viewer__main {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer__main-canvas-wrap {
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 80px);
}

.viewer__main-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.viewer__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222;
}

.viewer__nav:hover {
  background: #fff;
  transform: translateY(-50%) scale(1.1);
}

.viewer__nav--prev {
  left: 20px;
}

.viewer__nav--next {
  right: 20px;
}

.viewer__thumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  padding-right: 10px;
}

.viewer__thumbs::-webkit-scrollbar {
  width: 4px;
}

.viewer__thumbs::-webkit-scrollbar-track {
  background: transparent;
}

.viewer__thumbs::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.viewer__thumb {
  flex-shrink: 0;
  width: 80px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s, transform 0.2s;
  border: 2px solid transparent;
}

.viewer__thumb:hover {
  opacity: 0.8;
}

.viewer__thumb--active {
  opacity: 1;
  border-color: #222;
}

.viewer__thumb-canvas-wrap {
  width: 100%;
  height: 100%;
}

.viewer__thumb-canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.viewer__close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
}

.viewer__close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #222;
}

/* Responsive */
@media (max-width: 1200px) {
  .gallery__grid {
    grid-auto-rows: 100px;
  }
  
  .viewer {
    grid-template-columns: 150px 1fr 80px;
    padding: 30px;
  }
}

@media (max-width: 1024px) {
  .gallery__grid {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 110px;
  }
  
  .viewer {
    grid-template-columns: 1fr 80px;
    padding: 20px;
  }
  
  .viewer__left {
    display: none;
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
  
  .viewer {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    gap: 10px;
    padding: 15px;
  }
  
  .viewer__thumbs {
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    max-height: none;
    padding-bottom: 10px;
  }
  
  .viewer__thumb {
    width: 60px;
    height: 40px;
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
