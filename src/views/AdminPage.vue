<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGalleryStore } from '../stores/gallery'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

const galleryStore = useGalleryStore()
const { photos } = storeToRefs(galleryStore)

const password = ref('')
const isAuthenticated = ref<boolean>(false)
const error = ref('')

if (typeof window !== 'undefined') {
  const persisted = window.localStorage.getItem('isAdmin')
  isAuthenticated.value = persisted === 'true'
}

const handleLogin = () => {
  if (!password.value) {
    error.value = 'Введите пароль'
    return
  }

  if (password.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    error.value = ''
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('isAdmin', 'true')
    }
  } else {
    error.value = 'Неверный пароль'
  }
}

const handleLogout = () => {
  isAuthenticated.value = false
  password.value = ''
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('isAdmin')
  }
}

const handleFilesChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || !target.files.length) return

  const files = Array.from(target.files)

  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        galleryStore.addPhoto(result, file.name)
      }
    }
    reader.readAsDataURL(file)
  })

  // Чтобы при повторном выборе тех же файлов событие сработало
  target.value = ''
}
</script>

<template>
  <section class="page admin">
    <h2 class="page__title">Администрирование</h2>
    <p class="page__subtitle">
      Скрытая страница для загрузки работ в галерею. Ссылка на неё не отображается в меню.
    </p>

    <div v-if="!isAuthenticated" class="admin__card">
      <h3 class="admin__card-title">Вход для владельца сайта</h3>
      <p class="admin__hint">Адрес страницы можно держать в закладках, а пароль — в .env файле.</p>

      <form class="admin__form" @submit.prevent="handleLogin">
        <label class="admin__label">
          <span>Пароль</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="admin__input"
          />
        </label>

        <p v-if="error" class="admin__error">{{ error }}</p>

        <button type="submit" class="admin__button">Войти</button>
      </form>
    </div>

    <div v-else class="admin__card">
      <div class="admin__card-header">
        <h3 class="admin__card-title">Галерея</h3>
        <button type="button" class="admin__secondary" @click="handleLogout">Выйти</button>
      </div>

      <label class="admin__label admin__label--file">
        <span>Загрузить новые фотографии</span>
        <input
          type="file"
          accept="image/*"
          multiple
          class="admin__file-input"
          @change="handleFilesChange"
        />
      </label>

      <p class="admin__hint">
        Изображения сохраняются в браузере (localStorage) и отображаются на странице галереи. Для реального
        продакшена рекомендуется подключить сервер и файловое хранилище.
      </p>

      <div v-if="photos.length" class="admin__preview-grid">
        <article v-for="photo in photos" :key="photo.id" class="admin__preview-item">
          <img :src="photo.dataUrl" :alt="photo.title" class="admin__preview-image" />
        </article>
      </div>

      <p v-else class="admin__empty">Пока нет загруженных фотографий.</p>
    </div>
  </section>
</template>

<style scoped>
.page__title {
  font-size: 1.6rem;
  font-weight: 500;
  margin: 0 0 0.75rem;
}

.page__subtitle {
  margin: 0 0 1.5rem;
  color: #666;
}

.admin__card {
  padding: 1.5rem 1.75rem 1.75rem;
  border-radius: 0.9rem;
  background: #fafafa;
}

.admin__card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.admin__card-title {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

.admin__hint {
  margin: 0 0 1.25rem;
  font-size: 0.9rem;
  color: #777;
}

.admin__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 320px;
}

.admin__label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.95rem;
}

.admin__input {
  border-radius: 0.5rem;
  border: 1px solid #d0d0d0;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
}

.admin__button {
  align-self: flex-start;
  padding: 0.55rem 1.15rem;
  border-radius: 999px;
  border: none;
  background: #222;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}

.admin__button:hover {
  background: #000;
}

.admin__secondary {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 0.9rem;
  cursor: pointer;
}

.admin__secondary:hover {
  background: #f3f3f3;
}

.admin__error {
  margin: -0.25rem 0 0.25rem;
  font-size: 0.85rem;
  color: #c0392b;
}

.admin__label--file {
  margin-top: 0.75rem;
}

.admin__file-input {
  margin-top: 0.35rem;
  font-size: 0.9rem;
}

.admin__preview-grid {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.admin__preview-item {
  border-radius: 0.6rem;
  overflow: hidden;
  background: #f0f0f0;
}

.admin__preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.admin__empty {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #777;
}
</style>
