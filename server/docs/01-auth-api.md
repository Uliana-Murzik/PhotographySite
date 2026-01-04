# 🔐 Authentication API

## POST `/api/auth/register`

Регистрация нового пользователя (для создания администратора).

### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "login": "admin",
  "password": "admin123",
  "isAdmin": true
}
```

**Fields:**

- `login` (string, required) - Логин пользователя
- `password` (string, required) - Пароль (минимум 6 символов)
- `isAdmin` (boolean, optional) - Права администратора, default: false

### Response

**Success (201 Created):**

```json
{
  "message": "User successfully registered",
  "user": {
    "id": 1,
    "login": "admin",
    "isAdmin": true,
    "createdAt": "2026-01-04T15:10:31.154Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (409 Conflict):**

```json
{
  "error": "User already exists"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Login and password are required"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Registration failed"
}
```

---

## POST `/api/auth/login`

Вход в систему.

### Request

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "login": "admin",
  "password": "admin123"
}
```

**Fields:**

- `login` (string, required) - Логин пользователя
- `password` (string, required) - Пароль

### Response

**Success (200 OK):**

```json
{
  "message": "Successfully logged in",
  "user": {
    "id": 1,
    "login": "admin",
    "isAdmin": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401 Unauthorized):**

```json
{
  "error": "Invalid login or password"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Login and password are required"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Login failed"
}
```

---

## GET `/api/auth/verify`

Проверка действительности JWT токена.

### Request

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response

**Success (200 OK):**

```json
{
  "message": "Token is valid",
  "user": {
    "id": 1,
    "login": "admin",
    "isAdmin": true
  }
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
  "error": "Invalid token"
}
```

```json
{
  "error": "Token expired"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Authentication failed"
}
```

---

## Примечания

- JWT токен действует **7 дней**
- Пароли хешируются с помощью bcrypt (12 раундов)
- После создания первого администратора рекомендуется отключить регистрацию
