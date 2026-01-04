# 📋 API Codes & General Information

## 🔢 HTTP Status Codes

| Код     | Название              | Описание                                             |
| ------- | --------------------- | ---------------------------------------------------- |
| **200** | OK                    | Успешный запрос                                      |
| **201** | Created               | Ресурс успешно создан                                |
| **400** | Bad Request           | Неверный запрос (ошибка валидации)                   |
| **401** | Unauthorized          | Не авторизован (нет токена или токен недействителен) |
| **403** | Forbidden             | Доступ запрещен (недостаточно прав)                  |
| **404** | Not Found             | Ресурс не найден                                     |
| **409** | Conflict              | Конфликт (например, пользователь уже существует)     |
| **500** | Internal Server Error | Внутренняя ошибка сервера                            |

---

## 🔐 Аутентификация

### JWT Token

Для защищенных эндпоинтов требуется JWT токен в заголовке:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Получение токена

Токен получается при:

- Регистрации (`POST /api/auth/register`)
- Входе в систему (`POST /api/auth/login`)

### Срок действия

- JWT токен действует **7 дней**
- После истечения необходимо выполнить вход заново

### Роли пользователей

| Роль                     | `isAdmin` | Доступ                                             |
| ------------------------ | --------- | -------------------------------------------------- |
| **Обычный пользователь** | `false`   | Только просмотр (не используется в текущей версии) |
| **Администратор**        | `true`    | Полный доступ: создание, редактирование, удаление  |

---

## 🌐 Base URL

```
http://localhost:5000/api
```

Для продакшена замените на ваш домен.

---

## 📝 Content Types

### Request

```
Content-Type: application/json
```

Для загрузки файлов:

```
Content-Type: multipart/form-data
```

### Response

JSON endpoints:

```
Content-Type: application/json
```

Image endpoints:

```
Content-Type: image/jpeg
```

---

## 🔄 Rate Limiting

Сервер защищен от DDoS с помощью rate limiting:

- **Окно:** 15 минут
- **Максимум запросов:** 100 запросов с одного IP

При превышении лимита:

```json
{
  "error": "Too many requests, please try again later."
}
```

---

## 📸 Загрузка изображений

### Поддерживаемые форматы

- JPEG / JPG
- PNG
- WebP

### Ограничения

- **Максимальный размер файла:** 50 MB
- **Максимальное разрешение:** нет ограничений (оригинал сохраняется как есть)

### Обработка изображений

При загрузке автоматически создаются 3 версии:

| Версия        | Назначение             | Характеристики            |
| ------------- | ---------------------- | ------------------------- |
| **Оригинал**  | Для администратора     | Без изменений             |
| **Веб**       | Для просмотра на сайте | Качество 60%, макс 1200px |
| **Миниатюра** | Для галереи/превью     | 300x300px, качество 70%   |

---

## 🗂️ Структура ответов

### Успешный ответ (одиночный объект)

```json
{
  "id": 1,
  "name": "Album Name",
  "createdAt": "2026-01-04T15:20:00.000Z"
}
```

### Успешный ответ (массив)

```json
[
  { "id": 1, "name": "Album 1" },
  { "id": 2, "name": "Album 2" }
]
```

### Ответ с сообщением

```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Ошибка

```json
{
  "error": "Error message description"
}
```

---

## 📅 Формат дат

Все даты в формате **ISO 8601**:

```
2026-01-04T15:20:00.000Z
```

- UTC timezone
- Миллисекунды включены

---

## 🔍 Валидация

### Обязательные поля

Если обязательное поле отсутствует:

```json
{
  "error": "Field name is required"
}
```

### Уникальные поля

Если значение должно быть уникальным:

```json
{
  "error": "User already exists"
}
```

### Формат файлов

Если неподдерживаемый формат:

```json
{
  "error": "Неподдерживаемый формат файла. Разрешены только: JPEG, PNG, WebP"
}
```

---

## 🔗 Связи между сущностями

```
User (Admin)
    ↓ (создает)
Albums
    ↓ (содержит)
Images
```

### Cascade удаление

- При удалении **альбома** → удаляются все его **изображения**
- При удалении **изображения** → удаляются все его **версии** (оригинал, веб, миниатюра)

---

## 📦 Примеры использования

### cURL

```bash
# Регистрация
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","password":"pass123","isAdmin":true}'

# Создание альбома
curl -X POST http://localhost:5000/api/albums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"My Album","description":"Description"}'

# Загрузка фото
curl -X POST http://localhost:5000/api/images/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg" \
  -F "albumId=1" \
  -F "description=Beautiful photo"
```

### JavaScript (Fetch)

```javascript
// Вход
const response = await fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ login: "admin", password: "pass123" }),
});
const { token } = await response.json();

// Получить альбомы
const albums = await fetch("http://localhost:5000/api/albums").then((res) =>
  res.json()
);

// Создать альбом
await fetch("http://localhost:5000/api/albums", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ name: "New Album" }),
});

// Загрузить фото
const formData = new FormData();
formData.append("image", fileInput.files[0]);
formData.append("albumId", 1);
formData.append("description", "Photo description");

await fetch("http://localhost:5000/api/images/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
```

---

## 🛡️ Безопасность

### Реализованные меры

- ✅ **JWT аутентификация** (7 дней)
- ✅ **bcrypt хеширование паролей** (12 раундов)
- ✅ **Helmet** для защиты HTTP заголовков
- ✅ **Rate Limiting** (100 запросов/15 мин)
- ✅ **CORS** настроен
- ✅ **Sequelize** защита от SQL injection
- ✅ **Валидация файлов** (тип, размер)
- ✅ **Защита оригиналов** (только для админа)

### Рекомендации

- Используйте HTTPS в продакшене
- Храните JWT_SECRET в безопасном месте
- Регулярно обновляйте зависимости
- Настройте firewall
- Делайте бэкапы базы данных

---

## 🏥 Health Check

```
GET /health
```

**Response (200 OK):**

```json
{
  "status": "OK",
  "message": "Photography Backend is running",
  "timestamp": "2026-01-04T15:10:24.231Z"
}
```

Используйте для мониторинга работоспособности сервера.

---

## 📞 Поддержка

При возникновении проблем проверьте:

1. **Логи сервера** - все запросы логируются через Morgan
2. **Статус PostgreSQL** - `brew services list`
3. **Миграции** - `npm run db:migrate`
4. **Переменные окружения** - файл `.env`

---

## 🔄 Версионирование

Текущая версия API: **v1** (без версии в URL)

При необходимости добавления версии:

```
/api/v1/albums
/api/v2/albums
```
