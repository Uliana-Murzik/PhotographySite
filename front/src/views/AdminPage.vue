<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalleryStore, type Album } from '../stores/gallery'
import * as api from '../api'
import { getWebImageUrl } from '../api'

const galleryStore = useGalleryStore()
const { albums, imagesByAlbum, isLoading, error: storeError } = storeToRefs(galleryStore)

// Auth state
const login = ref('')
const password = ref('')
const isAuthenticated = ref(false)
const authError = ref('')
const isAuthLoading = ref(false)

const newAlbumName = ref('')
const newAlbumDescription = ref('')

const selectedAlbumId = ref<number | null>(null)

const editingAlbum = ref<Album | null>(null)
const editAlbumName = ref('')
const editAlbumDescription = ref('')

const isUploading = ref(false)
const uploadProgress = ref(0)

onMounted(async () => {
  const result = await api.verifyToken()
  if (result?.user?.isAdmin) {
    isAuthenticated.value = true
    await loadData()
  }
})

const defaultAlbumId = computed(() => albums.value[0]?.id || null)

async function loadData() {
  await galleryStore.fetchAll()
  if (albums.value.length && !selectedAlbumId.value) {
    selectedAlbumId.value = albums.value[0].id
  }
}

async function handleLogin() {
  if (!login.value || !password.value) {
    authError.value = 'Введите логин и пароль'
    return
  }

  isAuthLoading.value = true
  authError.value = ''

  try {
    const result = await api.login(login.value, password.value)

    if (!result.user.isAdmin) {
      authError.value = 'Требуются права администратора'
      api.logout()
      return
    }

    isAuthenticated.value = true
    await loadData()
  } catch (e) {
    authError.value = e instanceof Error ? e.message : 'Ошибка входа'
  } finally {
    isAuthLoading.value = false
  }
}

function handleLogout() {
  api.logout()
  isAuthenticated.value = false
  login.value = ''
  password.value = ''
}

async function handleCreateAlbum() {
  if (!newAlbumName.value.trim()) return

  const album = await galleryStore.addAlbum(
    newAlbumName.value.trim(),
    newAlbumDescription.value.trim() || undefined,
  )

  if (album) {
    newAlbumName.value = ''
    newAlbumDescription.value = ''
    selectedAlbumId.value = album.id
  }
}

function startEditAlbum(album: Album) {
  editingAlbum.value = album
  editAlbumName.value = album.name
  editAlbumDescription.value = album.description || ''
}

async function saveEditAlbum() {
  if (!editingAlbum.value || !editAlbumName.value.trim()) return

  await galleryStore.updateAlbum(editingAlbum.value.id, {
    name: editAlbumName.value.trim(),
    description: editAlbumDescription.value.trim() || undefined,
  })

  editingAlbum.value = null
}

function cancelEditAlbum() {
  editingAlbum.value = null
}

async function handleDeleteAlbum(albumId: number) {
  const photosCount = imagesByAlbum.value[albumId]?.length || 0
  const message =
    photosCount > 0 ? `Удалить альбом и все ${photosCount} фото в нём?` : 'Удалить пустой альбом?'

  if (confirm(message)) {
    await galleryStore.removeAlbum(albumId)
    if (selectedAlbumId.value === albumId) {
      selectedAlbumId.value = defaultAlbumId.value
    }
  }
}

async function handleFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files.length) return

  const albumId = selectedAlbumId.value || defaultAlbumId.value
  if (!albumId) {
    alert('Сначала создайте альбом')
    return
  }

  const files = Array.from(target.files)
  isUploading.value = true
  uploadProgress.value = 0

  for (let i = 0; i < files.length; i++) {
    await galleryStore.uploadImage(files[i], albumId, files[i].name)
    uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
  }

  isUploading.value = false
  uploadProgress.value = 0
  target.value = ''
}

async function handleDeletePhoto(photoId: number) {
  if (confirm('Удалить фотографию?')) {
    await galleryStore.removeImage(photoId)
  }
}
</script>

<template>
  <section class="page admin">
    <h2 class="page__title">Администрирование</h2>
    <p class="page__subtitle">
      Скрытая страница для управления альбомами и загрузки работ в галерею.
    </p>

    <!-- Форма входа -->
    <div v-if="!isAuthenticated" class="admin__card">
      <h3 class="admin__card-title">Вход для администратора</h3>
      <p class="admin__hint">Используйте логин и пароль.</p>

      <form class="admin__form" @submit.prevent="handleLogin">
        <label class="admin__label">
          <span>Логин</span>
          <input
            v-model="login"
            type="text"
            autocomplete="username"
            class="admin__input"
            :disabled="isAuthLoading"
          />
        </label>

        <label class="admin__label">
          <span>Пароль</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="admin__input"
            :disabled="isAuthLoading"
          />
        </label>

        <p v-if="authError" class="admin__error">{{ authError }}</p>

        <button type="submit" class="admin__button" :disabled="isAuthLoading">
          {{ isAuthLoading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>

    <div v-else class="admin__panel">
      <div class="admin__card-header">
        <h3 class="admin__card-title">Управление галереей</h3>
        <button type="button" class="admin__secondary" @click="handleLogout">Выйти</button>
      </div>

      <!-- Ошибка store -->
      <div v-if="storeError" class="admin__error-banner">
        {{ storeError }}
      </div>

      <div v-if="isLoading" class="admin__loading">Загрузка данных...</div>

      <!-- Создание альбома -->
      <div class="admin__card">
        <h4 class="admin__section-title">Создать альбом</h4>
        <form class="admin__form admin__form--inline" @submit.prevent="handleCreateAlbum">
          <input
            v-model="newAlbumName"
            type="text"
            placeholder="Название альбома"
            class="admin__input"
          />
          <input
            v-model="newAlbumDescription"
            type="text"
            placeholder="Описание (необязательно)"
            class="admin__input"
          />
          <button type="submit" class="admin__button" :disabled="!newAlbumName.trim()">
            Создать
          </button>
        </form>
      </div>

      <!-- Список альбомов -->
      <div v-if="albums.length" class="admin__card">
        <h4 class="admin__section-title">Альбомы</h4>

        <div class="admin__albums-list">
          <article
            v-for="album in albums"
            :key="album.id"
            class="admin__album"
            :class="{ 'admin__album--selected': selectedAlbumId === album.id }"
          >
            <!-- Режим редактирования -->
            <div v-if="editingAlbum?.id === album.id" class="admin__album-edit">
              <input
                v-model="editAlbumName"
                type="text"
                class="admin__input admin__input--small"
                placeholder="Название"
              />
              <input
                v-model="editAlbumDescription"
                type="text"
                class="admin__input admin__input--small"
                placeholder="Описание"
              />
              <div class="admin__album-actions">
                <button
                  type="button"
                  class="admin__icon-btn"
                  title="Сохранить"
                  @click="saveEditAlbum"
                >
                  ✓
                </button>
                <button
                  type="button"
                  class="admin__icon-btn"
                  title="Отмена"
                  @click="cancelEditAlbum"
                >
                  ✕
                </button>
              </div>
            </div>

            <div v-else class="admin__album-content" @click="selectedAlbumId = album.id">
              <div class="admin__album-info">
                <span class="admin__album-name">{{ album.name }}</span>
                <span class="admin__album-count">
                  {{ imagesByAlbum[album.id]?.length || 0 }} фото
                </span>
              </div>
              <div class="admin__album-actions">
                <button
                  type="button"
                  class="admin__icon-btn"
                  title="Редактировать"
                  @click.stop="startEditAlbum(album)"
                >
                  ✎
                </button>
                <button
                  type="button"
                  class="admin__icon-btn admin__icon-btn--danger"
                  title="Удалить"
                  @click.stop="handleDeleteAlbum(album.id)"
                >
                  🗑
                </button>
              </div>
            </div>

            <div v-if="imagesByAlbum[album.id]?.length" class="admin__album-photos">
              <div
                v-for="photo in imagesByAlbum[album.id]"
                :key="photo.id"
                class="admin__album-photo"
              >
                <img :src="getWebImageUrl(photo.id)" :alt="photo.originalName" />
                <button
                  type="button"
                  class="admin__photo-delete"
                  title="Удалить фото"
                  @click="handleDeletePhoto(photo.id)"
                >
                  ✕
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Загрузка фото -->
      <div class="admin__card">
        <h4 class="admin__section-title">Загрузить фотографии</h4>

        <div v-if="!albums.length" class="admin__hint">Сначала создайте хотя бы один альбом.</div>

        <div v-else class="admin__upload">
          <label class="admin__label">
            <span>Выберите альбом</span>
            <select v-model="selectedAlbumId" class="admin__select">
              <option v-for="album in albums" :key="album.id" :value="album.id">
                {{ album.name }}
              </option>
            </select>
          </label>

          <label class="admin__label admin__label--file">
            <span>Выберите файлы</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              class="admin__file-input"
              :disabled="(!selectedAlbumId && !defaultAlbumId) || isUploading"
              @change="handleFilesChange"
            />
          </label>

          <!-- Прогресбар -->
          <div v-if="isUploading" class="admin__progress">
            <div class="admin__progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
            <span class="admin__progress-text">Загрузка: {{ uploadProgress }}%</span>
          </div>
        </div>

        <p class="admin__hint">
          Изображения загружаются на сервер. Поддерживаемые форматы: JPEG, PNG, WebP. Максимальный
          размер файла: 50 MB.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page__title {
  font-size: 26px;
  font-weight: 500;
  margin: 0 0 12px;
}

.page__subtitle {
  margin: 0 0 24px;
  color: #666;
}

.admin__panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.admin__card {
  padding: 24px 28px 28px;
  border-radius: 14px;
  background: #fafafa;
}

.admin__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.admin__card-title {
  margin: 0 0 12px;
  font-size: 18px;
}

.admin__section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 500;
}

.admin__hint {
  margin: 12px 0 0;
  font-size: 14px;
  color: #777;
}

.admin__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;
}

.admin__form--inline {
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100%;
  align-items: flex-end;
}

.admin__form--inline .admin__input {
  flex: 1;
  min-width: 180px;
}

.admin__label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
}

.admin__input {
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  padding: 10px 14px;
  font-size: 15px;
}

.admin__input--small {
  padding: 6px 10px;
  font-size: 14px;
}

.admin__select {
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  padding: 10px 14px;
  font-size: 15px;
  background: #fff;
}

.admin__button {
  align-self: flex-start;
  padding: 10px 20px;
  border-radius: 999px;
  border: none;
  background: #222;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  white-space: nowrap;
}

.admin__button:hover:not(:disabled) {
  background: #000;
}

.admin__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin__secondary {
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}

.admin__secondary:hover {
  background: #f3f3f3;
}

.admin__error {
  margin: -4px 0 4px;
  font-size: 14px;
  color: #c0392b;
}

.admin__error-banner {
  padding: 12px 16px;
  border-radius: 8px;
  background: #fee;
  color: #c0392b;
  font-size: 14px;
}

.admin__loading {
  padding: 24px;
  text-align: center;
  color: #777;
}

.admin__label--file {
  margin-top: 12px;
}

.admin__file-input {
  margin-top: 6px;
  font-size: 14px;
}

.admin__upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;
}

/* Progress bar */
.admin__progress {
  position: relative;
  height: 24px;
  background: #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.admin__progress-bar {
  height: 100%;
  background: #222;
  transition: width 0.3s ease;
}

.admin__progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  mix-blend-mode: difference;
}

/* Albums list */
.admin__albums-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin__album {
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.admin__album--selected {
  border-color: #222;
}

.admin__album-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.admin__album-content:hover {
  background: #f0f0f0;
}

.admin__album-edit {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  align-items: center;
  flex-wrap: wrap;
}

.admin__album-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin__album-name {
  font-weight: 500;
  font-size: 15px;
}

.admin__album-count {
  font-size: 13px;
  color: #777;
}

.admin__album-actions {
  display: flex;
  gap: 8px;
}

.admin__icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.admin__icon-btn:hover {
  background: #f0f0f0;
}

.admin__icon-btn--danger:hover {
  background: #fee;
  border-color: #c0392b;
}

/* Album photos preview */
.admin__album-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.admin__album-photo {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.admin__album-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin__photo-delete {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin__album-photo:hover .admin__photo-delete {
  opacity: 1;
}

.admin__photo-delete:hover {
  background: #c0392b;
}
</style>
