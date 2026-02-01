<script setup lang="ts">
import { RouterLink } from 'vue-router'

const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=100006784621055',
    icon: 'facebook',
  },
  {
    name: 'Behance',
    url: 'https://www.behance.net/murashka',
    icon: 'behance',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/murashka_pictures/',
    icon: 'instagram',
  },
]
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__left">
        <p class="site-footer__copyright">© 2026 Ульяна Мурзик</p>
        <a href="mailto:Anastasia.art.food@gmail.com" class="site-footer__email">
          Anastasia.art.food@gmail.com
        </a>
        <nav class="site-footer__legal">
          <RouterLink to="/privacy" class="site-footer__legal-link">
            Политика конфиденциальности
          </RouterLink>
          <RouterLink to="/consent" class="site-footer__legal-link">
            Согласие на обработку данных
          </RouterLink>
        </nav>
      </div>

      <nav class="site-footer__social" aria-label="Социальные сети">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          :aria-label="link.name"
          class="site-footer__social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg v-if="link.icon === 'facebook'" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            />
          </svg>

          <svg v-if="link.icon === 'behance'" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"
            />
          </svg>

          <svg v-if="link.icon === 'instagram'" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            />
          </svg>
        </a>
      </nav>

      <div class="site-footer__right">
        <button type="button" class="site-footer__back-to-top" @click="scrollToTop">
          Наверх
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  padding: 40px 24px;
  border-top: 1px solid #e0e0e0;
}

.site-footer__inner {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.site-footer__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.site-footer__copyright {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.site-footer__email {
  font-size: 14px;
  color: #555;
  text-decoration: none;
}

.site-footer__email:hover {
  color: #000;
  text-decoration: underline;
}

.site-footer__legal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
}

.site-footer__legal-link {
  font-size: 13px;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s ease;
}

.site-footer__legal-link:hover {
  color: #111827;
  text-decoration: underline;
}

.site-footer__social {
  display: flex;
  gap: 12px;
  align-items: center;
}

.site-footer__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.site-footer__social-link:hover {
  background: #000;
  transform: scale(1.05);
}

.site-footer__social-link svg {
  width: 18px;
  height: 18px;
}

.site-footer__right {
  display: flex;
  align-items: center;
}

.site-footer__back-to-top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: color 0.2s ease;
}

.site-footer__back-to-top:hover {
  color: #000;
}

.site-footer__back-to-top svg {
  width: 16px;
  height: 16px;
}

@media (max-width: 640px) {
  .site-footer__inner {
    flex-direction: column;
    text-align: center;
  }

  .site-footer__left {
    align-items: center;
  }

  .site-footer__legal {
    justify-content: center;
  }

  .site-footer__right {
    order: -1;
  }
}
</style>
