# Photography Site - Backend (Sequelize + PostgreSQL)

Бэкенд для фотографического сайта с **Sequelize ORM** и **PostgreSQL**.

## 🔧 Технологии

- **Node.js** + **JavaScript**
- **Express** - веб-фреймворк
- **Sequelize** - ORM для работы с PostgreSQL
- **PostgreSQL** - реляционная база данных
- **Sharp** - обработка изображений
- **Multer** - загрузка файлов
- **JWT** - аутентификация
- **bcrypt** - хеширование паролей
- **Helmet** - безопасность
- **Morgan** - логирование

## 🛡️ Защита изображений

Система использует трехуровневую защиту фотографий:

1. **Оригиналы** (`uploads/originals/`) - высокое качество, только для админа
2. **Веб-версии** (`uploads/web/`) - **качество 60%, макс. 1200px** - для клиентов
3. **Миниатюры** (`uploads/thumbnails/`) - 300x300px для галереи

**Клиенты получают только низкокачественные веб-версии!**

## 📦 Установка и запуск

### 1. Установите зависимости:

```bash
cd server
npm install
```

### 2. Установите PostgreSQL

**macOS:**

```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 3. Создайте базу данных:

```bash
# Подключитесь к PostgreSQL
psql postgres

# Создайте пользователя и базу данных
CREATE USER photography_user WITH PASSWORD 'your_password';
CREATE DATABASE photography_db OWNER photography_user;
GRANT ALL PRIVILEGES ON DATABASE photography_db TO photography_user;
\q
```

### 4. Настройте переменные окружения

Создайте файл `.env` (скопируйте из `.env.example`):

```env
PORT=5001

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=photography_db
DB_USER=photography_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRES_IN=7d

NODE_ENV=development
```

### 5. Запустите миграции Sequelize:

```bash
# Создать БД (если еще не создали)
npm run db:create

# Запустить миграции
npm run db:migrate
```

### 6. Запустите сервер:

```bash
npm start
# или
npm run dev
```

Сервер запустится на **http://localhost:5000** 🎉

## 📊 Структура базы данных (Sequelize)

```
users
├── id (INTEGER, автоинкремент)
├── login (STRING, уникальный)
├── password_hash (STRING)
├── is_admin (BOOLEAN)
├── created_at (DATE)
└── updated_at (DATE)

albums
├── id (INTEGER, автоинкремент)
├── name (STRING)
├── description (TEXT)
├── cover_image_id (INTEGER → images.id)
├── created_at (DATE)
└── updated_at (DATE)

images
├── id (INTEGER, автоинкремент)
├── album_id (INTEGER → albums.id) CASCADE
├── original_path (STRING) - ТОЛЬКО АДМИН!
├── web_path (STRING) - для клиентов
├── thumbnail_path (STRING) - миниатюра
├── filename (STRING)
├── original_name (STRING)
├── mime_type (STRING)
├── size (INTEGER)
├── width (INTEGER)
├── height (INTEGER)
├── description (TEXT)
└── uploaded_at (DATE)
```

## 🚀 API Endpoints

### Аутентификация

```bash
# Регистрация (создание админа)
POST /api/auth/register
Body: { "login": "admin", "password": "pass123", "isAdmin": true }

# Вход
POST /api/auth/login
Body: { "login": "admin", "password": "pass123" }

# Проверка токена
GET /api/auth/verify
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
```

### Альбомы

```bash
# Получить все альбомы (публично)
GET /api/albums

# Получить альбом по ID (публично)
GET /api/albums/:id

# Создать альбом (только админ)
POST /api/albums
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
Body: { "name": "Свадьба", "description": "Описание" }

# Обновить альбом (только админ)
PUT /api/albums/:id

# Удалить альбом (только админ)
DELETE /api/albums/:id
```

### Изображения

```bash
# Получить все фото по альбомам (публично)
GET /api/images/all

# Получить фото конкретного альбома (публично)
GET /api/images/album/:albumId

# Загрузить фото (только админ)
POST /api/images/upload
Headers: { "Authorization": "Bearer YOUR_TOKEN" }
FormData: { "image": file, "albumId": 1, "description": "..." }

# Скачать веб-версию (НИЗКОЕ КАЧЕСТВО - публично)
GET /api/images/web/:id

# Скачать миниатюру (публично)
GET /api/images/thumbnail/:id

# Скачать оригинал (ТОЛЬКО АДМИН!)
GET /api/images/original/:id

# Обновить описание (только админ)
PUT /api/images/:id

# Удалить фото (только админ)
DELETE /api/images/:id
```

## 🎯 Первый запуск

### 1. Создайте администратора:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "SecurePassword123",
    "isAdmin": true
  }'
```

### 2. Войдите и получите токен:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "SecurePassword123"
  }'
```

### 3. Создайте первый альбом:

```bash
curl -X POST http://localhost:5000/api/albums \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Мой первый альбом",
    "description": "Тестовый альбом"
  }'
```

## 🔧 Sequelize команды

```bash
# Сбросить БД полностью (удалить, создать, мигрировать)
npm run dbreset

# Создать БД
npm run db:create

# Запустить миграции
npm run db:migrate

# Откатить последнюю миграцию
npm run db:migrate:undo

# Запустить сиды (если есть)
npm run db:seed
```

## 📁 Структура проекта

```
server/
├── config/
│   └── config.js               # Sequelize конфигурация
├── src/
│   ├── db/
│   │   ├── models/
│   │   │   ├── index.js        # Инициализация Sequelize
│   │   │   ├── user.js         # Модель User
│   │   │   ├── album.js        # Модель Album
│   │   │   └── image.js        # Модель Image
│   │   ├── migrations/         # Sequelize миграции
│   │   │   ├── 20240101000001-create-users.js
│   │   │   ├── 20240101000002-create-albums.js
│   │   │   └── 20240101000003-create-images.js
│   │   └── seeders/            # Сиды (опционально)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── albumController.js
│   │   └── imageController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── albums.js
│   │   └── images.js
│   ├── utils/
│   │   └── imageProcessor.js   # Sharp обработка
│   └── server.js               # Главный файл
├── uploads/                     # Загруженные файлы
│   ├── temp/
│   ├── originals/              # ТОЛЬКО АДМИН
│   ├── web/                    # Низкое качество
│   └── thumbnails/
├── .sequelizerc                 # Sequelize конфигурация путей
├── package.json
├── .env.example
└── README.md
```

## 🔍 Работа с Sequelize

### Пример использования в контроллере:

```javascript
const { Album, Image } = require("../db/models");

// Найти все альбомы с фотографиями
const albums = await Album.findAll({
  include: [{ model: Image, as: "images" }],
  order: [["createdAt", "DESC"]],
});

// Создать альбом
const album = await Album.create({
  name: "Новый альбом",
  description: "Описание",
});

// Обновить
await album.update({ name: "Обновленное название" });

// Удалить
await album.destroy(); // Cascade удалит все изображения
```

## 💡 Преимущества Sequelize

✅ **ORM** - работа через JavaScript объекты  
✅ **Миграции** - версионирование схемы БД  
✅ **Валидация** - встроенная в модели  
✅ **Ассоциации** - автоматические JOIN запросы  
✅ **Transaction** - поддержка транзакций  
✅ **Hooks** - beforeCreate, afterUpdate и т.д.

## 🔒 Безопасность

- ✅ JWT токены (7 дней)
- ✅ bcrypt для паролей (12 раундов)
- ✅ Helmet для HTTP заголовков
- ✅ Rate limiting (100 запросов/15 мин)
- ✅ CORS защита
- ✅ Sequelize защита от SQL injection
- ✅ Оригиналы доступны только админу

## 📄 Лицензия

ISC
