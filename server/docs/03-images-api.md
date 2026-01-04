# 🖼️ Images API

## GET `/api/images/all`

Получить все фотографии, сгруппированные по альбомам (публичный доступ).

### Request

Нет параметров.

### Response

**Success (200 OK):**

```json
[
  {
    "album": {
      "id": 1,
      "name": "Свадьба Иванова",
      "description": "Фотографии со свадьбы 2024",
      "coverImageId": 5,
      "createdAt": "2026-01-04T15:20:00.000Z"
    },
    "images": [
      {
        "id": 5,
        "filename": "abc123.jpg",
        "originalName": "wedding_photo1.jpg",
        "description": "Жених и невеста",
        "width": 4000,
        "height": 3000,
        "uploadedAt": "2026-01-04T15:25:00.000Z",
        "webUrl": "/api/images/web/5",
        "thumbnailUrl": "/api/images/thumbnail/5"
      },
      {
        "id": 6,
        "filename": "def456.jpg",
        "originalName": "wedding_photo2.jpg",
        "description": "Торт",
        "width": 3000,
        "height": 2000,
        "uploadedAt": "2026-01-04T15:30:00.000Z",
        "webUrl": "/api/images/web/6",
        "thumbnailUrl": "/api/images/thumbnail/6"
      }
    ]
  }
]
```

**Response Fields:**

- `webUrl` (string) - URL для получения веб-версии (качество 60%, макс 1200px)
- `thumbnailUrl` (string) - URL для получения миниатюры (300x300px)
- **Путь к оригиналу НЕ предоставляется!**

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch images"
}
```

---

## GET `/api/images/album/:albumId`

Получить все фотографии конкретного альбома (публичный доступ).

### Request

**URL Parameters:**

- `albumId` (integer, required) - ID альбома

**Example:**

```
GET /api/images/album/1
```

### Response

**Success (200 OK):**

```json
[
  {
    "id": 5,
    "filename": "abc123.jpg",
    "originalName": "wedding_photo1.jpg",
    "description": "Жених и невеста",
    "width": 4000,
    "height": 3000,
    "uploadedAt": "2026-01-04T15:25:00.000Z",
    "webUrl": "/api/images/web/5",
    "thumbnailUrl": "/api/images/thumbnail/5"
  }
]
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch images"
}
```

---

## POST `/api/images/upload`

Загрузить новую фотографию в альбом (только администратор).

### Request

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Body (FormData):**

```
image: [binary file]
albumId: 1
description: "Красивое фото"
```

**Fields:**

- `image` (file, required) - Файл изображения (JPEG, PNG, WebP)
- `albumId` (integer, required) - ID альбома
- `description` (string, optional) - Описание фотографии

**Ограничения:**

- Максимальный размер файла: **50 MB**
- Поддерживаемые форматы: **JPEG, JPG, PNG, WebP**

### Response

**Success (201 Created):**

```json
{
  "id": 5,
  "webUrl": "/api/images/web/5",
  "thumbnailUrl": "/api/images/thumbnail/5",
  "message": "Image uploaded successfully"
}
```

**Что происходит при загрузке:**

1. Оригинал сохраняется в `uploads/originals/`
2. Создается веб-версия: качество 60%, макс 1200px → `uploads/web/`
3. Создается миниатюра: 300x300px → `uploads/thumbnails/`
4. Если это первое фото в альбоме - устанавливается как обложка

**Error (400 Bad Request - No file):**

```json
{
  "error": "No file uploaded"
}
```

**Error (400 Bad Request - No albumId):**

```json
{
  "error": "Album ID is required"
}
```

**Error (400 Bad Request - Wrong format):**

```json
{
  "error": "Неподдерживаемый формат файла. Разрешены только: JPEG, PNG, WebP"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Album not found"
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Access token required"
}
```

**Error (403 Forbidden):**

```json
{
  "error": "Access denied. Admin privileges required"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to upload image"
}
```

---

## GET `/api/images/web/:id`

Получить веб-версию изображения (публичный доступ).

**⚠️ ВАЖНО:** Это версия с низким качеством (60%) и размером до 1200px!

### Request

**URL Parameters:**

- `id` (integer, required) - ID изображения

**Example:**

```
GET /api/images/web/5
```

### Response

**Success (200 OK):**

```
Content-Type: image/jpeg
[Binary image data - качество 60%, макс 1200px]
```

**Характеристики веб-версии:**

- Качество: **60%**
- Максимальная ширина/высота: **1200px**
- Формат: **JPEG**
- Пропорции сохраняются

**Error (404 Not Found):**

```json
{
  "error": "Image not found"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch image"
}
```

---

## GET `/api/images/thumbnail/:id`

Получить миниатюру изображения (публичный доступ).

### Request

**URL Parameters:**

- `id` (integer, required) - ID изображения

**Example:**

```
GET /api/images/thumbnail/5
```

### Response

**Success (200 OK):**

```
Content-Type: image/jpeg
[Binary image data - 300x300px]
```

**Характеристики миниатюры:**

- Размер: **300x300px**
- Качество: **70%**
- Формат: **JPEG**
- Обрезается по центру (fit: cover)

**Error (404 Not Found):**

```json
{
  "error": "Image not found"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch thumbnail"
}
```

---

## GET `/api/images/original/:id`

Получить оригинал изображения в полном качестве (ТОЛЬКО АДМИНИСТРАТОР).

### Request

**URL Parameters:**

- `id` (integer, required) - ID изображения

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**

```
GET /api/images/original/5
```

### Response

**Success (200 OK):**

```
Content-Type: image/jpeg (или оригинальный формат)
[Binary image data - ОРИГИНАЛЬНОЕ качество и размер]
```

**Error (404 Not Found):**

```json
{
  "error": "Image not found"
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Access token required"
}
```

**Error (403 Forbidden):**

```json
{
  "error": "Access denied. Admin privileges required"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch original image"
}
```

---

## PUT `/api/images/:id`

Обновить описание изображения (только администратор).

### Request

**URL Parameters:**

- `id` (integer, required) - ID изображения

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body:**

```json
{
  "description": "Новое описание фотографии"
}
```

**Fields:**

- `description` (string, required) - Новое описание

**Example:**

```
PUT /api/images/5
```

### Response

**Success (200 OK):**

```json
{
  "id": 5,
  "description": "Новое описание фотографии"
}
```

**Error (404 Not Found):**

```json
{
  "error": "Image not found"
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Access token required"
}
```

**Error (403 Forbidden):**

```json
{
  "error": "Access denied. Admin privileges required"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to update image"
}
```

---

## DELETE `/api/images/:id`

Удалить изображение и все его версии (только администратор).

### Request

**URL Parameters:**

- `id` (integer, required) - ID изображения

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**

```
DELETE /api/images/5
```

### Response

**Success (200 OK):**

```json
{
  "message": "Image deleted successfully"
}
```

**Что удаляется:**

- Запись из базы данных
- Оригинал из `uploads/originals/`
- Веб-версия из `uploads/web/`
- Миниатюра из `uploads/thumbnails/`

**Error (404 Not Found):**

```json
{
  "error": "Image not found"
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Access token required"
}
```

**Error (403 Forbidden):**

```json
{
  "error": "Access denied. Admin privileges required"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to delete image"
}
```

---

## 🛡️ Защита изображений

### Три версии каждой фотографии:

| Версия        | Путь                  | Качество | Размер       | Доступ       |
| ------------- | --------------------- | -------- | ------------ | ------------ |
| **Оригинал**  | `uploads/originals/`  | 100%     | Оригинальный | ТОЛЬКО админ |
| **Веб**       | `uploads/web/`        | 60%      | Макс 1200px  | Публично     |
| **Миниатюра** | `uploads/thumbnails/` | 70%      | 300x300px    | Публично     |

### Почему это защищает:

- ✅ Клиенты НЕ МОГУТ скачать оригиналы высокого качества
- ✅ Даже если скачают веб-версию - качество будет низким (60%)
- ✅ Размер ограничен (1200px) - непригоден для печати
- ✅ Путь к оригиналу НЕ раскрывается в API
- ✅ Оригиналы требуют JWT токен администратора

---

## Примечания

- Изображения сортируются по дате загрузки (новые первыми)
- Первая загруженная фотография автоматически становится обложкой альбома
- При удалении альбома все его фотографии удаляются автоматически (CASCADE)
- Sharp автоматически оптимизирует изображения
