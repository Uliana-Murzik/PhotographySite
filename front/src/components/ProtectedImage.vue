<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  src: string
  alt?: string
  fit?: 'cover' | 'contain'
  autoHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fit: 'contain',
  autoHeight: false,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const imageLoaded = ref(false)
const isLoading = ref(true)

let image: HTMLImageElement | null = null

// получаем реальные размеры контейнера
const getContainerSize = () => {
  if (!containerRef.value) return { width: 320, height: 240 }

  const rect = containerRef.value.getBoundingClientRect()
  let width = rect.width || containerRef.value.offsetWidth
  let height = rect.height || containerRef.value.offsetHeight

  // для абсолютно позиционированных элементов берём размеры из родителя
  if (!width || width < 1 || !height || height < 1) {
    const parent = containerRef.value.parentElement
    if (parent) {
      const parentRect = parent.getBoundingClientRect()
      width = width || parentRect.width || parent.offsetWidth
      height = height || parentRect.height || parent.offsetHeight
    }
  }

  return {
    width: width || 320,
    height: height || 240,
  }
}

const drawImage = () => {
  if (!canvasRef.value || !image || !imageLoaded.value || !containerRef.value) return

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d', { willReadFrequently: false })
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const imageWidth = image.naturalWidth || image.width
  const imageHeight = image.naturalHeight || image.height
  const imageAspect = imageWidth / imageHeight

  const { width: containerWidth, height: containerHeight } = getContainerSize()

  // определяем размеры canvas
  const displayWidth = containerWidth
  const displayHeight =
    props.autoHeight && props.fit === 'contain'
      ? containerWidth / imageAspect // галерея высота из пропорций
      : containerHeight // услуги фиксированная высота

  // устанавливаем размер canvas с учетом DPR для четкости
  canvas.width = displayWidth * dpr
  canvas.height = displayHeight * dpr
  canvas.style.width = `${displayWidth}px`
  canvas.style.height = `${displayHeight}px`

  // масштабирует контекст для DPR
  ctx.scale(dpr, dpr)

  ctx.clearRect(0, 0, displayWidth, displayHeight)

  let drawWidth = displayWidth
  let drawHeight = displayHeight
  let drawX = 0
  let drawY = 0

  if (props.fit === 'contain') {
    // сохраняет пропорции м вписывает в контейнер
    const scale = Math.min(displayWidth / imageWidth, displayHeight / imageHeight)
    drawWidth = imageWidth * scale
    drawHeight = imageHeight * scale
    drawX = (displayWidth - drawWidth) / 2
    drawY = (displayHeight - drawHeight) / 2
  } else if (props.fit === 'cover') {
    // заполняее контейнер и сохраняет пропорции
    const scale = Math.max(displayWidth / imageWidth, displayHeight / imageHeight)
    drawWidth = imageWidth * scale
    drawHeight = imageHeight * scale
    drawX = (displayWidth - drawWidth) / 2
    drawY = (displayHeight - drawHeight) / 2
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight)
}

const loadImage = () => {
  if (!props.src) return

  image = new Image()
  image.crossOrigin = 'anonymous'

  image.onload = () => {
    if (!canvasRef.value || !image || !containerRef.value) return

    imageLoaded.value = true
    isLoading.value = false

    // высота контейнера на осн пропорций (в галерее)
    if (props.fit === 'contain' && props.autoHeight) {
      const { width: containerWidth } = getContainerSize()
      const imageAspect =
        (image.naturalWidth || image.width) / (image.naturalHeight || image.height)
      containerRef.value.style.height = `${containerWidth / imageAspect}px`
    }

    setTimeout(() => drawImage(), 0)
  }

  image.onerror = () => {
    console.error('Failed to load image:', props.src)
    isLoading.value = false
  }

  image.src = props.src
}

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  return false
}

const handleDragStart = (e: DragEvent) => {
  e.preventDefault()
  return false
}

const handleSelectStart = (e: Event) => {
  e.preventDefault()
  return false
}

onMounted(() => {
  loadImage()

  if (containerRef.value) {
    containerRef.value.addEventListener('contextmenu', handleContextMenu)
    containerRef.value.addEventListener('dragstart', handleDragStart)
    containerRef.value.addEventListener('selectstart', handleSelectStart)

    //следим за изменением размера контейнера
    const resizeObserver = new ResizeObserver(() => {
      if (imageLoaded.value && image && containerRef.value) {
        // для галереи обновляем высоту контейнера
        if (props.fit === 'contain' && props.autoHeight) {
          const { width: containerWidth } = getContainerSize()
          if (containerWidth > 0) {
            const imageAspect =
              (image.naturalWidth || image.width) / (image.naturalHeight || image.height)
            containerRef.value.style.height = `${containerWidth / imageAspect}px`
          }
        }

        setTimeout(() => drawImage(), 10)
      }
    })

    resizeObserver.observe(containerRef.value)

    // сохраняем observer для очистки
    ;(containerRef.value as HTMLElement & { _resizeObserver?: ResizeObserver })._resizeObserver =
      resizeObserver
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('contextmenu', handleContextMenu)
    containerRef.value.removeEventListener('dragstart', handleDragStart)
    containerRef.value.removeEventListener('selectstart', handleSelectStart)

    // отключаем ResizeObserver
    const resizeObserver = (
      containerRef.value as HTMLElement & { _resizeObserver?: ResizeObserver }
    )?._resizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
  }
})

watch(
  () => props.src,
  () => {
    imageLoaded.value = false
    isLoading.value = true
    loadImage()
  },
)
</script>

<template>
  <div ref="containerRef" class="protected-image">
    <div v-if="isLoading" class="protected-image__skeleton" aria-label="Загрузка изображения">
      <div class="protected-image__skeleton-shimmer"></div>
    </div>

    <canvas
      ref="canvasRef"
      class="protected-image__canvas"
      :class="{ 'protected-image__canvas--loaded': imageLoaded }"
      :aria-label="alt || 'Protected image'"
    ></canvas>
    <div class="protected-image__overlay" aria-hidden="true"></div>
  </div>
</template>

<style scoped>
.protected-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: block;
}

.protected-image__canvas {
  width: 100%;
  height: 100%;
  display: block;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -moz-user-select: none;
  -ms-user-select: none;
  pointer-events: none;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.protected-image__canvas--loaded {
  opacity: 1;
}

.protected-image__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  pointer-events: auto;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  cursor: default;
}

.protected-image__skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
  overflow: hidden;
}

.protected-image__skeleton-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
