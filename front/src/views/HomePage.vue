<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import emailjs from '@emailjs/browser'

const authorImage = '/services/author.jpg'
const galleryImageLeft = '/services/03after.jpg'
const galleryImageRight = '/services/02after.jpg'
const servicesPreview = '/services/01after.jpg'

const route = useRoute()

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const isSending = ref(false)
const sendError = ref<string | null>(null)
const sendSuccess = ref(false)

watch(
  () => route.query.subject,
  (value) => {
    if (typeof value === 'string' && value.trim()) {
      form.value.subject = value
    }
  },
  { immediate: true },
)

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()
  sendError.value = null
  sendSuccess.value = false

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    sendError.value = 'Не настроена отправка: заполните VITE_EMAILJS_* в front/.env'
    return
  }

  isSending.value = true
  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        subject: form.value.subject || 'Заявка с главной страницы',
        message: form.value.message,
      },
      { publicKey },
    )

    sendSuccess.value = true
    form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  } catch (e) {
    sendError.value = 'Не удалось отправить. Попробуйте позже.'
    console.error(e)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="landing" id="top">
    <section class="hero">
      <div class="hero__content">
        <div class="hero__card">
          <h2 class="hero__name">АНАСТАСИЯ<br />ГОРБАЧЕВА</h2>
        </div>
        <p class="hero__subtitle">ретушер и преподаватель</p>
      </div>

      <div class="hero__image">
        <img :src="authorImage" alt="Анастасия Горбачева" />
      </div>
    </section>

    <section class="block">
      <div class="block__header">
        <h2 class="block__title">Галерея</h2>
        <RouterLink class="btn" to="/gallery">Подробнее</RouterLink>
      </div>

      <div class="preview preview--gallery">
        <img class="preview__img preview__img--small" :src="galleryImageLeft" alt="Пример работы" />
        <img class="preview__img" :src="galleryImageRight" alt="Пример работы" />
      </div>
    </section>

    <section class="block">
      <div class="block__header">
        <h2 class="block__title">Услуги</h2>
        <RouterLink class="btn" to="/services">Подробнее</RouterLink>
      </div>

      <div class="preview preview--services">
        <img class="preview__img preview__img--wide" :src="servicesPreview" alt="Услуги" />
        <p class="preview__caption">Цветокоррекция</p>
      </div>
    </section>

    <section class="block">
      <div class="block__header">
        <h2 class="block__title">Обучение</h2>
      </div>

      <div class="courses">
        <div class="course-card">
          <div class="course-card__box" aria-hidden="true"></div>
          <p class="course-card__label">Личная<br />консультация</p>
        </div>
        <div class="course-card">
          <div class="course-card__box" aria-hidden="true"></div>
          <p class="course-card__label">Lightroom.<br />Каталог и Обработка</p>
        </div>
        <div class="course-card">
          <div class="course-card__box" aria-hidden="true"></div>
          <p class="course-card__label">Adobe Photoshop<br />с нуля</p>
        </div>
      </div>

      <a class="btn btn--wide" href="#consultation">Записаться</a>
    </section>

    <section class="block" id="consultation">
      <div class="block__header block__header--right">
        <h2 class="block__title">Персональная онлайн-консультация</h2>
      </div>

      <form class="consultation__form" @submit="handleSubmit">
        <label class="consultation__label">
          <span>Имя</span>
          <input v-model="form.name" type="text" class="consultation__input" required />
        </label>

        <label class="consultation__label">
          <span>Email</span>
          <input v-model="form.email" type="email" class="consultation__input" required />
        </label>

        <label class="consultation__label">
          <span>Телефон</span>
          <input v-model="form.phone" type="tel" class="consultation__input" required />
        </label>

        <label class="consultation__label">
          <span>Тема</span>
          <input v-model="form.subject" type="text" class="consultation__input" required />
        </label>

        <label class="consultation__label">
          <span>Сообщение</span>
          <textarea
            v-model="form.message"
            class="consultation__textarea"
            rows="5"
            required
          ></textarea>
        </label>

        <button type="submit" class="consultation__submit" :disabled="isSending">
          {{ isSending ? 'Отправка...' : 'Отправить' }}
        </button>

        <p v-if="sendError" class="consultation__status consultation__status--error">
          {{ sendError }}
        </p>
        <p v-else-if="sendSuccess" class="consultation__status consultation__status--success">
          Спасибо! Сообщение отправлено.
        </p>
      </form>
    </section>

    <button class="to-top" type="button" @click="scrollToTop">Наверх</button>
  </div>
</template>

<style scoped>
.landing {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 32px;
  align-items: center;
  min-height: 380px;
}

.hero__card {
  background: #9fb1bd;
  border-radius: 14px;
  padding: 20px 22px;
  max-width: 420px;
}

.hero__name {
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.05;
  font-size: 34px;
}

.hero__subtitle {
  margin: 14px 0 0;
  font-size: 18px;
  color: #3b3b3b;
}

.hero__image img {
  width: 100%;
  max-width: 360px;
  height: auto;
  display: block;
  object-fit: cover;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.block__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.block__header--right {
  justify-content: flex-end;
}

.block__title {
  margin: 0;
  font-size: 34px;
  font-weight: 500;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid #8aa3b1;
  color: #1f2a33;
  background: transparent;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn--wide {
  align-self: center;
  min-width: 220px;
}

.preview {
  display: grid;
  gap: 18px;
}

.preview--gallery {
  grid-template-columns: 0.8fr 1.2fr;
  align-items: end;
}

.preview--services {
  grid-template-columns: 1fr;
  gap: 10px;
}

.preview__img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.preview__img--small {
  max-width: 260px;
}

.preview__img--wide {
  max-width: 520px;
}

.preview__caption {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.courses {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

.course-card {
  display: grid;
  place-items: center;
  gap: 10px;
}

.course-card__box {
  width: 110px;
  height: 110px;
  border: 1px solid #b9c1c8;
  background: transparent;
}

.course-card__label {
  margin: 0;
  font-size: 12px;
  text-align: center;
  color: #1f2a33;
}

/* Форма консультации (перенесена с Services) */
.consultation__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
}

.consultation__label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 15px;
}

.consultation__label span {
  font-weight: 500;
  color: #333;
}

.consultation__input,
.consultation__textarea {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.consultation__input:focus,
.consultation__textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.consultation__textarea {
  resize: vertical;
  min-height: 120px;
}

.consultation__submit {
  align-self: flex-start;
  padding: 12px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.consultation__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.consultation__status {
  margin: 4px 0 0;
  font-size: 14px;
}

.consultation__status--error {
  color: #c0392b;
}

.consultation__status--success {
  color: #1e7e34;
}

.consultation__submit:hover {
  background: #1d4ed8;
}

.to-top {
  position: sticky;
  bottom: 18px;
  align-self: flex-end;
  background: none;
  border: none;
  padding: 0;
  color: #333;
  font-size: 12px;
  cursor: pointer;
}

.to-top:hover {
  color: #000;
}

@media (max-width: 820px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero__image img {
    max-width: 320px;
  }

  .courses {
    grid-template-columns: 1fr;
  }

  /* consultation__form и так column */
}
</style>
