<script setup lang="ts">
import aboutImage from '../assets/about.jpg'
</script>

<template>
  <section class="about">
    <div class="about__content">
      <div class="about__image-wrapper">
        <img :src="aboutImage" alt="Анастасия Горбачева" class="about__image" />
      </div>

      <div class="about__text">
        <h1 class="about__name">Анастасия Горбачева</h1>
        <p class="about__role">Ретушер и преподаватель</p>

        <div class="about__paragraphs">
          <p class="about__paragraph">
            У меня два профильных образования – фотограф-искусствовед и графически дизайнер. В
            прошлом я несколько лет работала коммерческим фотографом в предметной и food-съёмке, что
            позволяет мне глубже понимать задачи и визуальные требования к финальному изображению
            фотографов и брендов.
          </p>

          <p class="about__paragraph">
            С 2022 года я являюсь старшим преподавателем в ИГУМО и МКИК, где обучаю студентов
            компьютерной обработке изображений и ретуши в различных жанрах.
          </p>

          <p class="about__paragraph">
            Как практикующий ретушер я специализируюсь на интерьерной фотографии. Вместе с
            фотографом Лизой Гуровской мы создаем проекты, опубликованные в интерьерных журналах и
            онлайн-изданиях. В то же время я открыта к сотрудничеству и в других направлениях.
          </p>

          <p class="about__paragraph">Я работаю с клиентами онлайн по всему миру.</p>
        </div>

        <div class="about__contacts">
          <a href="#" class="about__contact-link" aria-label="Telegram">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.09-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a href="#" class="about__contact-link" aria-label="WhatsApp">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a href="#" class="about__contact-link" aria-label="Email">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  width: 100%;
}

.about__content {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.about__image-wrapper {
  flex-shrink: 0;
}

.about__image {
  width: 100%;
  max-width: 400px;
  height: auto;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.about__text {
  flex: 1;
  min-width: 0;
}

.about__name {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px;
  letter-spacing: 0.02em;
}

.about__role {
  font-size: 18px;
  color: #666;
  margin: 0 0 32px;
  font-weight: 400;
}

.about__paragraphs {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.about__paragraph {
  margin: 0;
  line-height: 1.7;
  color: #333;
}

.about__contacts {
  display: flex;
  gap: 24px;
  align-items: center;
}

.about__contact-link {
  color: #333;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__contact-link:hover {
  color: #000;
}

.about__contact-link svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 768px) {
  .about__content {
    flex-direction: column;
    gap: 32px;
  }

  .about__image {
    max-width: 100%;
  }

  .about__name {
    font-size: 26px;
  }
}
</style>
