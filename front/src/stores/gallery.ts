import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as api from '../api'

export interface Album {
  id: number
  name: string
  description: string | null
  coverImageId: number | null
  createdAt: string
}

export interface GalleryImage {
  id: number
  filename: string
  originalName: string
  description: string | null
  width: number
  height: number
  uploadedAt: string
  webUrl: string
  thumbnailUrl: string
  albumId: number
}

export const useGalleryStore = defineStore('gallery', () => {
  const albums = ref<Album[]>([])
  const images = ref<GalleryImage[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed: фото сгруппированные по альбомам
  const imagesByAlbum = computed(() => {
    const grouped: Record<number, GalleryImage[]> = {}
    for (const album of albums.value) {
      grouped[album.id] = images.value.filter((img) => img.albumId === album.id)
    }
    return grouped
  })

  // Computed: альбомы с фотографиями (для отображения в галерее)
  const albumsWithImages = computed(() => {
    return albums.value.filter((album) => imagesByAlbum.value[album.id]?.length > 0)
  })

  // Загрузка всех данных с сервера
  async function fetchAll() {
    isLoading.value = true
    error.value = null

    try {
      const data = await api.fetchAllImages()

      albums.value = data.map((item) => ({
        id: item.album.id,
        name: item.album.name,
        description: item.album.description,
        coverImageId: item.album.coverImageId,
        createdAt: item.album.createdAt,
      }))

      images.value = data.flatMap((item) =>
        item.images.map((img) => ({
          ...img,
          albumId: item.album.id,
        })),
      )
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки данных'
      console.error('Failed to fetch gallery data:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Загрузка только альбомов (для админки)
  async function fetchAlbums() {
    isLoading.value = true
    error.value = null

    try {
      const data = await api.fetchAlbums()
      albums.value = data.map((album) => ({
        id: album.id,
        name: album.name,
        description: album.description,
        coverImageId: album.coverImageId,
        createdAt: album.createdAt,
      }))
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки альбомов'
      console.error('Failed to fetch albums:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Создание альбома
  async function addAlbum(name: string, description?: string): Promise<Album | null> {
    try {
      const album = await api.createAlbum(name, description)
      const newAlbum: Album = {
        id: album.id,
        name: album.name,
        description: album.description,
        coverImageId: album.coverImageId,
        createdAt: album.createdAt,
      }
      albums.value.push(newAlbum)
      return newAlbum
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка создания альбома'
      console.error('Failed to create album:', e)
      return null
    }
  }

  // Обновление альбома
  async function updateAlbum(
    id: number,
    data: { name?: string; description?: string },
  ): Promise<boolean> {
    try {
      const updated = await api.updateAlbum(id, data)
      const index = albums.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        albums.value[index] = {
          ...albums.value[index],
          name: updated.name,
          description: updated.description,
        }
      }
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка обновления альбома'
      console.error('Failed to update album:', e)
      return false
    }
  }

  // Удаление альбома
  async function removeAlbum(id: number): Promise<boolean> {
    try {
      await api.deleteAlbum(id)
      albums.value = albums.value.filter((a) => a.id !== id)
      images.value = images.value.filter((img) => img.albumId !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка удаления альбома'
      console.error('Failed to delete album:', e)
      return false
    }
  }

  // Загрузка изображения
  async function uploadImage(
    file: File,
    albumId: number,
    description?: string,
  ): Promise<GalleryImage | null> {
    try {
      const result = await api.uploadImage(file, albumId, description)

      const newImage: GalleryImage = {
        id: result.id,
        filename: '',
        originalName: file.name,
        description: description || null,
        width: 0,
        height: 0,
        uploadedAt: new Date().toISOString(),
        webUrl: result.webUrl,
        thumbnailUrl: result.thumbnailUrl,
        albumId,
      }

      images.value.push(newImage)
      return newImage
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка загрузки изображения'
      console.error('Failed to upload image:', e)
      return null
    }
  }

  // Удаление изображения
  async function removeImage(id: number): Promise<boolean> {
    try {
      await api.deleteImage(id)
      images.value = images.value.filter((img) => img.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Ошибка удаления изображения'
      console.error('Failed to delete image:', e)
      return false
    }
  }

  return {
    albums,
    images,
    isLoading,
    error,
    imagesByAlbum,
    albumsWithImages,
    fetchAll,
    fetchAlbums,
    addAlbum,
    updateAlbum,
    removeAlbum,
    uploadImage,
    removeImage,
  }
})
