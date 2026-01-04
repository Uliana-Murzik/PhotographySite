# 🚀 ГОТОВО! Sequelize + PostgreSQL

## ✅ Что получилось:

Полностью рабочий бэкенд на **Sequelize ORM + PostgreSQL** (как в вашем примере!)

---

## 📋 Быстрый старт:

### 1️⃣ Установите зависимости:

```bash
cd /Users/evenov/Desktop/Uliana/PhotographySite/server
npm install
```

### 2️⃣ Установите PostgreSQL:

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Linux
sudo apt install postgresql
sudo systemctl start postgresql
```

### 3️⃣ Создайте базу данных:

```bash
psql postgres

CREATE USER photography_user WITH PASSWORD 'your_password';
CREATE DATABASE photography_db OWNER photography_user;
GRANT ALL PRIVILEGES ON DATABASE photography_db TO photography_user;
\q
```

### 4️⃣ Настройте `.env`:

```bash
cp .env.example .env
# Отредактируйте .env с вашими параметрами БД
```

### 5️⃣ Запустите миграции:

```bash
npm run db:migrate
```

### 6️⃣ Запустите сервер:

```bash
npm start
```

**Готово!** Сервер на http://localhost:5000 🎉

---

## 🔥 Ключевые команды:

```bash
npm start           # Запустить сервер с nodemon
npm run dbreset     # Сбросить БД полностью
npm run db:migrate  # Запустить миграции
npm run db:seed     # Запустить сиды
```

---

## 📊 Структура (Sequelize):

```
server/
├── config/
│   └── config.js                  # Sequelize конфиг
├── src/
│   ├── db/
│   │   ├── models/                # Sequelize модели
│   │   │   ├── user.js
│   │   │   ├── album.js
│   │   │   └── image.js
│   │   └── migrations/            # SQL миграции
│   ├── controllers/               # Бизнес-логика
│   ├── middleware/                # Auth, Upload
│   ├── routes/                    # API routes
│   └── server.js                  # Главный файл
├── .sequelizerc
└── package.json
```

---

## 💡 Отличия от чистого SQL:

| Aspect    | Чистый SQL                      | Sequelize                |
| --------- | ------------------------------- | ------------------------ |
| Запросы   | `query('SELECT * FROM users')`  | `User.findAll()`         |
| Создание  | `INSERT INTO users VALUES(...)` | `User.create({...})`     |
| Миграции  | Ручные SQL файлы                | `sequelize-cli`          |
| Связи     | Ручные JOIN                     | Автоматические `include` |
| Валидация | Ручная                          | Встроенная в модели      |

---

## 🛡️ Защита фото:

1. Админ загружает → создаются 3 версии
2. `originals/` - только админ (`/api/images/original/:id`)
3. `web/` - **качество 60%, 1200px** (`/api/images/web/:id`)
4. `thumbnails/` - 300x300px (`/api/images/thumbnail/:id`)

**Клиенты получают только низкое качество!**

---

## 📖 Документация:

Откройте `README.md` для:

- Полного описания API
- Примеров использования
- Работы с Sequelize
- Интеграции с фронтендом

---

**Всё готово к работе!** 🚀
