# 📁 Albums API

## GET `/api/albums`

Получить список всех альбомов (публичный доступ).

### Request

Нет параметров.

### Response

**Success (200 OK):**

```json
[
  {
    "id": 1,
    "name": "Свадьба Иванова",
    "description": "Фотографии со свадьбы 2024",
    "coverImageId": 5,
    "createdAt": "2026-01-04T15:20:00.000Z",
    "updatedAt": "2026-01-04T15:20:00.000Z",
    "images": [
      {
        "id": 5
      },
      {
        "id": 6
      }
    ]
  },
  {
    "id": 2,
    "name": "Портреты",
    "description": "Портретная съемка",
    "coverImageId": null,
    "createdAt": "2026-01-04T16:00:00.000Z",
    "updatedAt": "2026-01-04T16:00:00.000Z",
    "images": []
  }
]
```

**Response Fields:**

- `id` (integer) - ID альбома
- `name` (string) - Название альбома
- `description` (string|null) - Описание альбома
- `coverImageId` (integer|null) - ID фотографии-обложки
- `createdAt` (datetime) - Дата создания
- `updatedAt` (datetime) - Дата последнего обновления
- `images` (array) - Массив объектов с ID изображений в альбоме

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch albums"
}
```

---

## GET `/api/albums/:id`

Получить информацию о конкретном альбоме со всеми фотографиями (публичный доступ).

### Request

**URL Parameters:**

- `id` (integer, required) - ID альбома

**Example:**

```
GET /api/albums/1
```

### Response

**Success (200 OK):**

```json
{
  "id": 1,
  "name": "Свадьба Иванова",
  "description": "Фотографии со свадьбы 2024",
  "coverImageId": 5,
  "createdAt": "2026-01-04T15:20:00.000Z",
  "updatedAt": "2026-01-04T15:20:00.000Z",
  "images": [
    {
      "id": 5,
      "filename": "abc123.jpg",
      "originalName": "wedding_photo1.jpg",
      "description": "Жених и невеста",
      "width": 4000,
      "height": 3000,
      "uploadedAt": "2026-01-04T15:25:00.000Z"
    },
    {
      "id": 6,
      "filename": "def456.jpg",
      "originalName": "wedding_photo2.jpg",
      "description": "Торт",
      "width": 3000,
      "height": 2000,
      "uploadedAt": "2026-01-04T15:30:00.000Z"
    }
  ]
}
```

**Error (404 Not Found):**

```json
{
  "error": "Album not found"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to fetch album"
}
```

---

## POST `/api/albums`

Создать новый альбом (только администратор).

### Request

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Свадьба Иванова",
  "description": "Фотографии со свадьбы 2024"
}
```

**Fields:**

- `name` (string, required) - Название альбома
- `description` (string, optional) - Описание альбома

### Response

**Success (201 Created):**

```json
{
  "id": 1,
  "name": "Свадьба Иванова",
  "description": "Фотографии со свадьбы 2024",
  "coverImageId": null,
  "createdAt": "2026-01-04T15:20:00.000Z",
  "updatedAt": "2026-01-04T15:20:00.000Z"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Album name is required"
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
  "error": "Failed to create album"
}
```

---

## PUT `/api/albums/:id`

Обновить информацию об альбоме (только администратор).

### Request

**URL Parameters:**

- `id` (integer, required) - ID альбома

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Свадьба Иванова - Обновлено",
  "description": "Новое описание",
  "coverImageId": 5
}
```

**Fields (все опциональные):**

- `name` (string) - Новое название альбома
- `description` (string) - Новое описание
- `coverImageId` (integer) - ID новой фотографии-обложки

**Example:**

```
PUT /api/albums/1
```

### Response

**Success (200 OK):**

```json
{
  "id": 1,
  "name": "Свадьба Иванова - Обновлено",
  "description": "Новое описание",
  "coverImageId": 5,
  "createdAt": "2026-01-04T15:20:00.000Z",
  "updatedAt": "2026-01-04T16:00:00.000Z"
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
  "error": "Failed to update album"
}
```

---

## DELETE `/api/albums/:id`

Удалить альбом и все его фотографии (только администратор).

### Request

**URL Parameters:**

- `id` (integer, required) - ID альбома

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**

```
DELETE /api/albums/1
```

### Response

**Success (200 OK):**

```json
{
  "message": "Album and all images deleted successfully"
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
  "error": "Failed to delete album"
}
```

---

## Примечания

- При удалении альбома автоматически удаляются все связанные изображения (CASCADE)
- Первая загруженная в альбом фотография автоматически становится обложкой
- Альбомы сортируются по дате создания (новые первыми)
