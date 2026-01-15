import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue'),
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('../views/ServicesPage.vue'),
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: () => import('../views/GalleryPage.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CoursesPage.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutPage.vue'),
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('../views/ContactsPage.vue'),
  },
  {
    // Скрытая страница с админкой (не отображается в навигации)
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

export default router
