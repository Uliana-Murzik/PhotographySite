<script setup lang="ts"></script>

<template>
  <section class="page">
    <h2 class="page__title">Контакты</h2>
    <p class="page__subtitle">
      Пу пу пу
    </p>

    <ul class="contacts-list">
      <li class="contacts-list__item">
        <span class="contacts-list__label">E-mail</span>
        <span class="contacts-list__value">example@mail.com</span>
      </li>
      <li class="contacts-list__item">
        <span class="contacts-list__label">Instagram</span>
        <span class="contacts-list__value">@username</span>
      </li>
      <li class="contacts-list__item">
        <span class="contacts-list__label">Telegram</span>
        <span class="contacts-list__value">@username</span>
      </li>
    </ul>
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

.contacts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contacts-list__item {
  display: flex;
  flex-direction: column;
}

.contacts-list__label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #999;
}

.contacts-list__value {
  font-size: 16px;
}
</style>
