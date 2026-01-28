<script setup lang="ts">
import { ref } from 'vue'
import BeforeAfterSlider from '../components/BeforeAfterSlider.vue'
import ConsultationForm from '../components/ConsultationForm.vue'

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

const consultationFormRef = ref<InstanceType<typeof ConsultationForm> | null>(null)

const fillSubject = (subject: string): void => {
  consultationFormRef.value?.setSubject(subject)
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
            :frame-ratio="4 / 3"
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

    <section class="service-section service-section--consultation">
      <h2 class="service-section__title">Персональная онлайн-консультация</h2>
      <p class="service-section__subtitle">
        Напиши мне — и я отвечу на вопросы по ретуши и обработке в Adobe Lightroom / Photoshop.
      </p>

      <ConsultationForm
        ref="consultationFormRef"
        form-id="consultation-form"
        :prevent-multiple-submissions="true"
      />
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
