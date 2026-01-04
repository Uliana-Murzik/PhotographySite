# 📚 Photography API Documentation

Полная документация API для Photography Backend.

## 📖 Содержание

1. [Authentication API](./01-auth-api.md) - Регистрация, вход, проверка токена
2. [Albums API](./02-albums-api.md) - Работа с альбомами
3. [Images API](./03-images-api.md) - Загрузка и получение изображений
4. [General Information](./04-general-info.md) - Коды ответов, форматы, примеры

---

## 🚀 Быстрый старт

### Base URL

```
http://localhost:5000/api
```

### Основные эндпоинты

| Метод  | Путь                     | Описание             | Доступ        |
| ------ | ------------------------ | -------------------- | ------------- |
| POST   | `/auth/register`         | Регистрация          | Публично      |
| POST   | `/auth/login`            | Вход                 | Публично      |
| GET    | `/auth/verify`           | Проверка токена      | Требует токен |
| GET    | `/albums`                | Список альбомов      | Публично      |
| POST   | `/albums`                | Создать альбом       | Только админ  |
| GET    | `/albums/:id`            | Альбом по ID         | Публично      |
| PUT    | `/albums/:id`            | Обновить альбом      | Только админ  |
| DELETE | `/albums/:id`            | Удалить альбом       | Только админ  |
| GET    | `/images/all`            | Все фото по альбомам | Публично      |
| GET    | `/images/album/:albumId` | Фото альбома         | Публично      |
| POST   | `/images/upload`         | Загрузить фото       | Только админ  |
| GET    | `/images/web/:id`        | Веб-версия фото      | Публично      |
| GET    | `/images/thumbnail/:id`  | Миниатюра            | Публично      |
| GET    | `/images/original/:id`   | Оригинал             | Только админ  |
| PUT    | `/images/:id`            | Обновить описание    | Только админ  |
| DELETE | `/images/:id`            | Удалить фото         | Только админ  |

---

## 🔐 Аутентификация

Для защищенных эндпоинтов добавьте заголовок:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Получите токен через:

- `POST /api/auth/register`
- `POST /api/auth/login`

---

## 📸 Защита изображений

При загрузке фотографии создаются **3 версии**:

| Версия        | Качество | Размер       | Доступ       |
| ------------- | -------- | ------------ | ------------ |
| **Оригинал**  | 100%     | Оригинальный | ТОЛЬКО админ |
| **Веб**       | 60%      | Макс 1200px  | Публично     |
| **Миниатюра** | 70%      | 300x300px    | Публично     |

**Клиенты НЕ МОГУТ скачать оригиналы!**

---

## 💡 Примеры использования

### Создать администратора

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123","isAdmin":true}'
```

### Войти в систему

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"admin123"}'
```

Сохраните полученный `token`.

### Создать альбом

```bash
export TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/albums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Свадьба","description":"Фотографии со свадьбы"}'
```

### Загрузить фото

```bash
curl -X POST http://localhost:5000/api/images/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/photo.jpg" \
  -F "albumId=1" \
  -F "description=Красивое фото"
```

### Получить все альбомы с фото

```bash
curl http://localhost:5000/api/images/all
```

---

## 🗂️ Структура документации

```
docs/
├── README.md                   ← Этот файл (обзор)
├── 01-auth-api.md             ← Аутентификация
├── 02-albums-api.md           ← Альбомы
├── 03-images-api.md           ← Изображения
└── 04-general-info.md         ← Общая информация
```

---

## 🔢 HTTP Статус коды

| Код | Описание         |
| --- | ---------------- |
| 200 | Успешный запрос  |
| 201 | Ресурс создан    |
| 400 | Ошибка валидации |
| 401 | Не авторизован   |
| 403 | Доступ запрещен  |
| 404 | Не найдено       |
| 409 | Конфликт         |
| 500 | Ошибка сервера   |

---

## 🛡️ Безопасность

- ✅ JWT токены (7 дней)
- ✅ bcrypt для паролей (12 раундов)
- ✅ Helmet для HTTP заголовков
- ✅ Rate Limiting (100 запросов/15 мин)
- ✅ CORS настроен
- ✅ Sequelize защита от SQL injection
- ✅ Валидация файлов
- ✅ Защита оригиналов изображений

---

## 📦 Технологии

- **Node.js** + **JavaScript**
- **Express** - веб-фреймворк
- **Sequelize** - ORM
- **PostgreSQL** - база данных
- **Sharp** - обработка изображений
- **JWT** - аутентификация
- **bcrypt** - хеширование паролей

---

## 🏥 Health Check

```bash
curl http://localhost:5000/health
```

```json
{
  "status": "OK",
  "message": "Photography Backend is running",
  "timestamp": "2026-01-04T15:10:24.231Z"
}
```

---

## 📞 Помощь

Если что-то не работает:

1. Проверьте логи сервера (Morgan)
2. Проверьте PostgreSQL: `brew services list`
3. Проверьте миграции: `npm run db:migrate`
4. Проверьте `.env` файл
5. Проверьте токен JWT

---

## 🔄 Версия API

**Текущая версия:** v1 (без префикса в URL)

---

**Готово! Используйте эту документацию для интеграции с фронтендом.**

© 2026 Photography Backend
