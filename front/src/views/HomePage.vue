<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ConsultationForm from '../components/ConsultationForm.vue'

const authorImage = '/services/author.jpg'
const galleryImageLeft = '/services/03after.jpg'
const galleryImageRight = '/services/02after.jpg'
const servicesPreview = '/services/01after.jpg'
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
      <div class="block__header block__header--left">
        <h2 class="block__title">Персональная онлайн-консультация</h2>
      </div>

      <ConsultationForm form-id="consultation" />
    </section>
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
  padding-top: 24px;
}

.block__header--right {
  justify-content: flex-end;
}

.block__header--left {
  justify-content: flex-start;
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
</style>
