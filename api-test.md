---

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123",
  "role": "doctor"
}
```

**Available Roles:** `admin` | `doctor` | `nurse` | `patient` | `secretary`

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "671b4a8f9e2d1c3f4a5b6c7d",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "doctor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login User

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "671b4a8f9e2d1c3f4a5b6c7d",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "doctor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Headers:**
**Success Response (200):**

```json
{
  "user": {
    "id": "671b4a8f9e2d1c3f4a5b6c7d",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "doctor",
    "isActive": true,
    "createdAt": "2025-10-13T12:34:56.789Z"
  }
}
```
