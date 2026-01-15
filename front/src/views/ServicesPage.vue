<script setup lang="ts">
import { reactive, ref } from 'vue'
import emailjs from '@emailjs/browser'
import BeforeAfterSlider from '../components/BeforeAfterSlider.vue'

type ServiceImageVariant = 'before' | 'after'

const getServiceImage = (index: string, variant: ServiceImageVariant) =>
  `/services/${index}${variant}.jpg`

const colorCorrectionBefore = getServiceImage('01', 'before')
const colorCorrectionAfter = getServiceImage('01', 'after')

const retouchingBefore = getServiceImage('02', 'before')
const retouchingAfter = getServiceImage('02', 'after')

const fullProcessingBefore = getServiceImage('03', 'before')
const fullProcessingAfter = getServiceImage('03', 'after')

const presetsBefore = getServiceImage('04', 'before')
const presetsAfter = getServiceImage('04', 'after')

const FORM_SENT_KEY = 'consultation_form_sent'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const isSending = ref(false)
const sendError = ref<string | null>(null)
const sendSuccess = ref(false)
const formAlreadySent = ref(false)

// Проверяем при загрузке, была ли форма уже отправлена
if (typeof window !== 'undefined') {
  formAlreadySent.value = localStorage.getItem(FORM_SENT_KEY) === 'true'
}

const fillSubject = (subject: string) => {
  form.subject = subject
  document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  // Если уже отправлена, не отправляем еще раз
  if (formAlreadySent.value) {
    return
  }

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
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject || 'Заявка со страницы услуг',
        message: form.message,
      },
      { publicKey },
    )

    sendSuccess.value = true
    formAlreadySent.value = true

    // Сохраняем в localStorage что форма была отправлена
    if (typeof window !== 'undefined') {
      localStorage.setItem(FORM_SENT_KEY, 'true')
    }
  } catch (e) {
    sendError.value = 'Не удалось отправить. Попробуйте позже.'
    console.error(e)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="services">
    <section class="services__intro">
      <h1 class="services__intro-title">Выбери то, что подходит именно тебе</h1>
    </section>

    <section class="service-section">
      <div class="service-card">
        <div class="service-card__text">
          <h2 class="service-section__title">Цветокоррекция</h2>
          <p class="service-section__subtitle">Работа с цветом и светом без детальной ретуши</p>

          <ul class="service-section__features">
            <li>на основе Raw/DNG</li>
            <li>выравнивание тонового баланса</li>
            <li>создание чистого цвета</li>
          </ul>

          <button
            class="service-section__button"
            type="button"
            @click="fillSubject('Цветокоррекция')"
          >
            Заказать
          </button>
        </div>

        <div class="service-card__media">
          <BeforeAfterSlider
            :before-image="colorCorrectionBefore"
            :after-image="colorCorrectionAfter"
            before-label="До"
            after-label="После"
          />
        </div>
      </div>
    </section>

    <section class="service-section">
      <div class="service-card">
        <div class="service-card__text">
          <h2 class="service-section__title">Ретушь</h2>
          <p class="service-section__subtitle">Детальная работа с изображением</p>

          <ul class="service-section__features">
            <li>на основе Raw/DNG</li>
            <li>тоновый баланс и чистый цвет</li>
            <li>ретушь по ТЗ</li>
          </ul>

          <button class="service-section__button" type="button" @click="fillSubject('Ретушь')">
            Заказать
          </button>
        </div>

        <div class="service-card__media">
          <BeforeAfterSlider
            :before-image="retouchingBefore"
            :after-image="retouchingAfter"
            before-label="До"
            after-label="После"
          />
        </div>
      </div>
    </section>

    <section class="service-section">
      <div class="service-card">
        <div class="service-card__text">
          <h2 class="service-section__title">Полная обработка фото</h2>
          <p class="service-section__subtitle">
            Комплексная работа с изображением: от проявки Raw до детальной ретуши
          </p>

          <ul class="service-section__features">
            <li>удаление лишних объектов и отражений</li>
            <li>добавление картин и предметов декора</li>
            <li>разглаживание мятых поверхностей</li>
          </ul>

          <button
            class="service-section__button"
            type="button"
            @click="fillSubject('Полная обработка фото')"
          >
            Заказать
          </button>
        </div>

        <div class="service-card__media">
          <BeforeAfterSlider
            :before-image="fullProcessingBefore"
            :after-image="fullProcessingAfter"
            before-label="До"
            after-label="После"
          />
        </div>
      </div>
    </section>

    <section class="service-section">
      <div class="service-card">
        <div class="service-card__text">
          <h2 class="service-section__title">Пресеты</h2>
          <p class="service-section__subtitle">Готовые наборы пресетов для обработки интерьеров</p>

          <ul class="service-section__features">
            <li>возможность создания уникального стиля по вашему ТЗ и предпочтениям</li>
          </ul>

          <button class="service-section__button" type="button" @click="fillSubject('Пресеты')">
            Заказать
          </button>
        </div>

        <div class="service-card__media service-card__media--small">
          <BeforeAfterSlider
            :before-image="presetsBefore"
            :after-image="presetsAfter"
            image-fit="contain"
            :frame-ratio="4 / 3"
            before-label="До"
            after-label="После"
          />
        </div>
      </div>
    </section>

    <section id="consultation-form" class="service-section service-section--consultation">
      <h2 class="service-section__title">Персональная онлайн-консультация</h2>
      <p class="service-section__subtitle">
        Напиши мне — и я отвечу на вопросы по ретуши и обработке в Adobe Lightroom / Photoshop.
      </p>

      <!-- Сообщение об успешной отправке -->
      <div v-if="formAlreadySent" class="consultation__success-message">
        <div class="consultation__success-icon">✓</div>
        <h3 class="consultation__success-title">Форма отправлена</h3>
        <p class="consultation__success-text">
          Спасибо! Ваше сообщение успешно отправлено. Я свяжусь с вами в ближайшее время.
        </p>
      </div>

      <!-- Форма (скрывается после отправки) -->
      <form v-else class="consultation__form" @submit="handleSubmit">
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

        <button type="submit" class="consultation__submit" :disabled="isSending || formAlreadySent">
          {{ isSending ? 'Отправка...' : 'Отправить' }}
        </button>

        <p v-if="sendError" class="consultation__status consultation__status--error">
          {{ sendError }}
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.services {
  width: 100%;
}

.services__intro {
  max-width: 1100px;
  margin: 0 auto 48px;
  padding: 0 24px;
}

.services__intro-title {
  font-size: 30px;
  font-weight: 300; /* Light */
  margin: 0;
  letter-spacing: 0.01em;
  line-height: 1.05;
}

.service-section {
  margin-bottom: 72px;
  padding: 0 24px;
}

.service-card {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(320px, 520px);
  gap: 40px;
  align-items: stretch;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.service-card__text {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
}

.service-card__media {
  width: 100%;
  justify-self: end;
  align-self: center;
}

.service-section__title {
  font-size: 30px;
  font-weight: 500; /* Medium */
  margin: 0;
}

.service-section__subtitle {
  font-size: 18px;
  font-weight: 400; /* Regular */
  color: #111827;
  margin: 0;
  line-height: 1.55;
}

.service-section__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.service-section__features li {
  color: #111827;
  font-weight: 300; /* Light */
}

.service-section__button {
  align-self: flex-start;
  padding: 11px 28px;
  background: transparent;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.35);
  border-radius: 999px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.service-card__text .service-section__button {
  margin-top: auto;
}

.service-section__button:hover {
  background: rgba(15, 23, 42, 0.06);
  border-color: rgba(15, 23, 42, 0.5);
}

.service-card__media--small {
  max-width: 460px;
}

.service-section--consultation {
  margin-bottom: 48px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.consultation__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  margin-top: 24px;
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

.consultation__submit:hover {
  background: #1d4ed8;
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

.consultation__success-message {
  max-width: 500px;
  margin: 24px auto 0;
  padding: 48px 32px;
  text-align: center;
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 16px;
}

.consultation__success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: #0ea5e9;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.consultation__success-title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 500;
  color: #0f172a;
}

.consultation__success-text {
  margin: 0;
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .service-card {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .service-card__media {
    justify-self: start;
  }
}
</style>
