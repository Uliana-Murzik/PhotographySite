<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

interface Props {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  /**
   * Как вписывать изображение в рамку:
   * - cover: заполняет рамку, может обрезаться
   * - contain: показывает целиком, могут появиться поля
   */
  imageFit?: 'cover' | 'contain'
  /**
   * Соотношение высоты к ширине (height/width).
   * Пример: 2/3 ≈ 0.666 (горизонтальный кадр), 4/3 ≈ 1.333 (вертикальнее).
   */
  frameRatio?: number
}

const props = withDefaults(defineProps<Props>(), {
  beforeLabel: 'До',
  afterLabel: 'После',
  imageFit: 'cover',
  frameRatio: 2 / 3,
})

const sliderRef = ref<HTMLElement | null>(null)
const sliderPosition = ref(50)
const isDragging = ref(false)

const containerStyle = computed(() => ({
  paddingBottom: `${props.frameRatio * 100}%`,
}))

const imageClass = computed(() => [
  'before-after-slider__image',
  props.imageFit === 'contain'
    ? 'before-after-slider__image--contain'
    : 'before-after-slider__image--cover',
])

const handleMouseDown = () => {
  isDragging.value = true
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !sliderRef.value) return

  const rect = sliderRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const percentage = (x / rect.width) * 100
  sliderPosition.value = Math.max(0, Math.min(100, percentage))
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div
    ref="sliderRef"
    class="before-after-slider"
    @mousedown="handleMouseDown"
  >
    <div class="before-after-slider__container" :style="containerStyle">
      <div class="before-after-slider__image-wrapper before-after-slider__image-wrapper--after">
        <img :src="afterImage" :alt="afterLabel" :class="imageClass" />
      </div>

      <div
        class="before-after-slider__image-wrapper before-after-slider__image-wrapper--before"
        :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }"
      >
        <img :src="beforeImage" :alt="beforeLabel" :class="imageClass" />
      </div>

      <div
        class="before-after-slider__divider"
        :style="{ left: `${sliderPosition}%` }"
      >
        <div class="before-after-slider__line"></div>
        <div class="before-after-slider__handle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 5L16 12L8 19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 5L8 12L16 19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="before-after-slider__labels">
        <span class="before-after-slider__label before-after-slider__label--before">
          {{ beforeLabel }}
        </span>
        <span class="before-after-slider__label before-after-slider__label--after">
          {{ afterLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.before-after-slider {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  cursor: col-resize;
  user-select: none;
  -webkit-user-select: none;
}

.before-after-slider__container {
  position: relative;
  width: 100%;
  padding-bottom: 66.67%; /* дефолт: 3:2, но обычно переопределяется через prop frameRatio */
  overflow: hidden;
  border-radius: 0.5rem;
  background: #f2f2f2;
}

.before-after-slider__image-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.before-after-slider__image-wrapper--after {
  z-index: 1;
}

.before-after-slider__image-wrapper--before {
  z-index: 2;
  clip-path: inset(0 50% 0 0);
}

.before-after-slider__image {
  width: 100%;
  height: 100%;
  display: block;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.before-after-slider__image--cover {
  object-fit: cover;
}

.before-after-slider__image--contain {
  object-fit: contain;
}

.before-after-slider__divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4px;
  transform: translateX(-50%);
  z-index: 3;
  cursor: col-resize;
}

.before-after-slider__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #2563eb;
  transform: translateX(-50%);
}

.before-after-slider__handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.before-after-slider__handle svg {
  width: 20px;
  height: 20px;
}

.before-after-slider__labels {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 4;
  pointer-events: none;
}

.before-after-slider__label {
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.before-after-slider__label--before {
  margin-right: auto;
}

.before-after-slider__label--after {
  margin-left: auto;
}
</style>
