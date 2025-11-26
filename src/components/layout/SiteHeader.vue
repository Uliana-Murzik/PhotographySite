<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { label: 'Услуги', to: '/services', name: 'services' },
  { label: 'Галерея', to: '/gallery', name: 'gallery' },
  { label: 'Онлайн-курсы', to: '/courses', name: 'courses' },
  { label: 'Обо мне', to: '/about', name: 'about' },
  { label: 'Контакты', to: '/contacts', name: 'contacts' },
]

const isActive = (name: string) => computed(() => route.name === name)
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div class="site-header__top">
        <h1 class="site-header__title">Анастасия Горбачева</h1>
        <p class="site-header__subtitle">Ретушер</p>
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
  padding: 2.5rem 1.5rem 0;
}

.site-header__inner {
  max-width: 960px;
  margin: 0 auto;
}

.site-header__top {
  text-align: center;
  margin-bottom: 1.5rem;
}

.site-header__title {
  font-size: 2.4rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  margin: 0 0 0.25rem;
}

.site-header__subtitle {
  margin: 0;
  font-size: 1.1rem;
  color: #555;
}

.site-header__nav {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 2rem;
  font-size: 0.98rem;
}

.site-header__link {
  text-decoration: none;
  color: #222;
  letter-spacing: 0.04em;
  text-transform: none;
}

.site-header__link--active {
  font-weight: 600;
}

.site-header__divider {
  margin-top: 1.5rem;
  border: none;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 720px) {
  .site-header__nav {
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .site-header__title {
    font-size: 1.8rem;
  }
}
</style>
