<script setup lang="ts">
import { type ComputedRef } from 'vue';
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems: { label: string; to: string; name: string }[] = [
  { label: 'Услуги', to: '/services', name: 'services' },
  { label: 'Галерея', to: '/gallery', name: 'gallery' },
  { label: 'Онлайн-курсы', to: '/courses', name: 'courses' },
  { label: 'Обо мне', to: '/about', name: 'about' },
  { label: 'Контакты', to: '/contacts', name: 'contacts' },
]

const isActive = (name: string): ComputedRef<boolean> => computed(() => route.name === name)
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div class="site-header__top">
        <h1 class="site-header__title">Анастасия Горбачева</h1>
        <RouterLink to="/" class="site-header__subtitle-link">Ретушер</RouterLink>
      </div>

      <nav class="site-header__nav" aria-label="Главная навигация">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="site-header__link"
          :class="{ 'site-header__link--active': isActive(item.name).value }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>

    <hr class="site-header__divider" />
  </header>
</template>

<style scoped>
.site-header {
  padding: 40px 24px 0;
}

.site-header__inner {
  max-width: 960px;
  margin: 0 auto;
}

.site-header__top {
  text-align: center;
  margin-bottom: 24px;
}

.site-header__title {
  font-size: 38px;
  font-weight: 400;
  letter-spacing: 0.06em;
  margin: 0 0 4px;
}

.site-header__subtitle {
  margin: 0;
  font-size: 18px;
  color: #555;
}

.site-header__subtitle-link {
  display: inline-block;
  margin: 0;
  font-size: 18px;
  color: #555;
  text-decoration: none;
}

.site-header__subtitle-link:hover {
  color: #222;
}

.site-header__nav {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 32px;
  font-size: 16px;
}

.site-header__link {
  text-decoration: none;
  color: #222;
  letter-spacing: 0.04em;
}

.site-header__link--active {
  font-weight: 600;
}

.site-header__divider {
  margin-top: 24px;
  border: none;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 720px) {
  .site-header__nav {
    gap: 20px;
    flex-wrap: wrap;
  }

  .site-header__title {
    font-size: 29px;
  }
}
</style>
