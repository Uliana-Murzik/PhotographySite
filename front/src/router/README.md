# Vue Router - Best Practices

## 📍 Где настраивать роуты

Все роуты настраиваются в **`src/router/index.ts`**

## 🎯 Best Practices

### 1. **Используйте lazy loading**

```typescript
component: () => import('@/views/HomePage.vue')
```

Это улучшает начальную загрузку приложения.

### 2. **Давайте имена роутам**

```typescript
{
  path: '/about',
  name: 'about', // Для программной навигации
  component: () => import('@/views/AboutPage.vue')
}
```

### 3. **Типизация**

Используйте `RouteRecordRaw[]` для типов роутов.

## 🔗 Навигация

### Через ссылки (в template):

```vue
<RouterLink to="/about">О нас</RouterLink>
<RouterLink :to="{ name: 'about' }">О нас</RouterLink>
```

### Программная навигация (в script):

```typescript
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/about')
router.push({ name: 'about' })
router.push({ name: 'photo-detail', params: { id: '123' } })
```

## 📄 Примеры роутов

### Простой роут:

```typescript
{
  path: '/about',
  name: 'about',
  component: () => import('@/views/AboutPage.vue')
}
```

### Роут с параметром:

```typescript
{
  path: '/photo/:id',
  name: 'photo-detail',
  component: () => import('@/views/PhotoDetailPage.vue')
}
```

Использование:

```typescript
const route = useRoute()
const photoId = route.params.id // Получить параметр
```

### Роут с query параметрами:

```typescript
// URL: /search?q=photo
const route = useRoute()
const query = route.query.q // 'photo'
```

### Роут с meta данными:

```typescript
{
  path: '/admin',
  name: 'admin',
  component: () => import('@/views/AdminPage.vue'),
  meta: { requiresAuth: true }
}
```

## 🛡️ Защита роутов (Guards)

```typescript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
```

## 📁 Структура файлов

```
src/
  router/
    index.ts       ← Основной файл с роутами
    guards.ts      ← Navigation guards (опционально)
  views/
    HomePage.vue   ← Страницы/компоненты
    AboutPage.vue
```

