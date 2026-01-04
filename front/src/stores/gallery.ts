import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface GalleryPhoto {
  id: string
  dataUrl: string
  title?: string
  createdAt: string
}

const STORAGE_KEY = 'galleryPhotos'

function loadFromStorage(): GalleryPhoto[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw) as GalleryPhoto[]
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('Не удалось прочитать галерею из localStorage', error)
    return []
  }
}

function saveToStorage(photos: GalleryPhoto[]) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(photos))
  } catch (error) {
    console.warn('Не удалось сохранить галерею в localStorage', error)
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useGalleryStore = defineStore('gallery', () => {
  const photos = ref<GalleryPhoto[]>(loadFromStorage())

  const addPhoto = (dataUrl: string, title?: string) => {
    photos.value.push({
      id: createId(),
      dataUrl,
      title,
      createdAt: new Date().toISOString(),
    })

    saveToStorage(photos.value)
  }

  const removePhoto = (id: string) => {
    photos.value = photos.value.filter((photo) => photo.id !== id)
    saveToStorage(photos.value)
  }

  const clear = () => {
    photos.value = []
    saveToStorage(photos.value)
  }

  return {
    photos,
    addPhoto,
    removePhoto,
    clear,
  }
})
