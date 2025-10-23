# ✅ Refresh Token Implementation - Complete

## 🎯 Overview

A complete JWT Refresh Token system has been successfully implemented in the CareFlow EHR API. This provides enhanced security with short-lived access tokens and long-lived refresh tokens.

---

## 🔐 Token System

### Access Token

- **Lifetime:** 15 minutes
- **Purpose:** Used for authenticating API requests
- **Storage:** Client-side (memory or secure storage)
- **Header:** `Authorization: Bearer <accessToken>`

### Refresh Token

- **Lifetime:** 7 days
- **Purpose:** Used to obtain new access tokens when they expire
- **Storage:** Database (User model) + Client-side secure storage
- **Security:** Invalidated on logout

---

## 📋 Implementation Details

### 1. **Database Changes** (models/User.js)

✅ Added `refreshToken` field to User schema

```javascript
refreshToken: { type: String, default: null }
```

### 2. **Service Layer** (services/authService.js)

✅ Created token generation functions:

- `generateAccessToken(userId, role)` - Creates 15-minute access token
- `generateRefreshToken(userId, role)` - Creates 7-day refresh token
- `refreshAccessToken(refreshToken)` - Validates and refreshes access token

✅ Updated authentication functions:

- `registerUser()` - Now returns both tokens
- `loginUser()` - Now returns both tokens and stores refresh token in DB
- `logoutUser()` - Clears refresh token from database

### 3. **Controller Layer** (controllers/authController.js)

✅ Updated existing controllers:

- `register` - Returns accessToken + refreshToken
- `login` - Returns accessToken + refreshToken
- `logout` - Invalidates refresh token

✅ New controller:

- `refreshToken` - Endpoint to refresh access token

### 4. **Routes** (routes/authRoutes.js)

✅ Added new route:

```javascript
POST / api / auth / refresh - token;
```

### 5. **Documentation** (documentation-api.md)

✅ Updated API documentation with:

- Authentication system overview
- Token flow explanation
- Refresh token endpoint documentation
- Updated login/register response formats

---

## 🚀 API Endpoints

### 1. Register

**POST** `/api/auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

**POST** `/api/auth/login`

**Request:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Refresh Token (NEW) ⭐

**POST** `/api/auth/refresh-token`

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "message": "Access token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  }
}
```

**Error Responses:**

```json
// Missing refresh token
{
  "message": "Refresh token is required"
}

// Invalid refresh token
{
  "message": "Invalid refresh token"
}

// Expired refresh token
{
  "message": "Refresh token expired. Please login again"
}
```

### 4. Logout

**POST** `/api/auth/logout`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

**Note:** Invalidates the refresh token in the database.

---

## 🔄 Token Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Authentication Flow                  │
└─────────────────────────────────────────────────────────────┘

1. Login/Register
   Client ──────────> Server
            credentials
   Client <────────── Server
            { accessToken, refreshToken }

2. API Request
   Client ──────────> Server
            Authorization: Bearer <accessToken>
   Client <────────── Server
            { data }

3. Access Token Expires (after 15 minutes)
   Client ──────────> Server
            Authorization: Bearer <expiredToken>
   Client <────────── Server
            { message: "Invalid or expired token" }

4. Refresh Access Token
   Client ──────────> Server
            { refreshToken }
   Client <────────── Server
            { accessToken, user }

5. Logout
   Client ──────────> Server
            Authorization: Bearer <accessToken>
   Client <────────── Server
            { message: "Logout successful" }
            (refreshToken cleared from DB)
```

---

## 🛡️ Security Features

### ✅ Implemented

1. **Short-lived Access Tokens** - Reduces window of token theft exploitation
2. **Separate Refresh Token Secret** - Can use different secret key (JWT_REFRESH_SECRET)
3. **Database Token Storage** - Refresh tokens stored and validated against DB
4. **Token Invalidation on Logout** - Refresh token cleared from database
5. **Token Verification** - Both tokens verified on use
6. **Error Handling** - Comprehensive error messages for token issues

### 🔒 Best Practices Applied

- Access tokens have short lifespan (15 minutes)
- Refresh tokens stored securely in database
- Tokens invalidated on logout
- Separate secrets for access and refresh tokens
- Proper error handling and user feedback

---

## ⚙️ Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your_access_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_refresh_secret_key_here_change_in_production

# Optional: Token expiration times (already set in code)
# JWT_ACCESS_EXP=15m
# JWT_REFRESH_EXP=7d
```

**Important:**

- Use strong, unique secrets for both tokens
- Never commit `.env` file to version control
- Use different secrets in production

---

## 📱 Client-Side Implementation Guide

### Example: React/JavaScript Client

```javascript
// Store tokens after login/register
const handleLogin = async (email, password) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Store tokens securely
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
};

// API request with automatic token refresh
const apiRequest = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  // Try request with current access token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If access token expired, refresh it
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");

    // Get new access token
    const refreshResponse = await fetch("/api/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("accessToken", data.accessToken);

      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.accessToken}`,
        },
      });
    } else {
      // Refresh token expired, redirect to login
      window.location.href = "/login";
      return;
    }
  }

  return response;
};

// Logout
const handleLogout = async () => {
  const accessToken = localStorage.getItem("accessToken");

  await fetch("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Clear tokens
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Redirect to login
  window.location.href = "/login";
};
```

---

## 🧪 Testing

### Test Scenarios

1. **Login/Register** ✅

   - Verify both tokens are returned
   - Tokens are different
   - Tokens contain correct user data

2. **API Request with Valid Token** ✅

   - Request succeeds with valid access token
   - User data accessible via req.user

3. **Expired Access Token** ✅

   - Request fails with 401
   - Error message: "Invalid or expired token"

4. **Refresh Token** ✅

   - Valid refresh token returns new access token
   - Invalid refresh token returns 401
   - Expired refresh token returns appropriate error

5. **Logout** ✅
   - Refresh token cleared from database
   - Subsequent refresh attempts fail

### Example Test Cases

```javascript
// Test refresh token endpoint
describe("POST /api/auth/refresh-token", () => {
  it("should return new access token with valid refresh token", async () => {
    // Login first
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    const { refreshToken } = loginRes.body;

    // Wait for access token to expire or use expired token
    // Then refresh
    const refreshRes = await request(app)
      .post("/api/auth/refresh-token")
      .send({ refreshToken });

    expect(refreshRes.status).to.equal(200);
    expect(refreshRes.body).to.have.property("accessToken");
    expect(refreshRes.body).to.have.property("user");
  });

  it("should reject invalid refresh token", async () => {
    const refreshRes = await request(app)
      .post("/api/auth/refresh-token")
      .send({ refreshToken: "invalid_token" });

    expect(refreshRes.status).to.equal(401);
    expect(refreshRes.body.message).to.include("Invalid");
  });
});
```

---

## 📊 Summary of Changes

| File                            | Changes                                         |
| ------------------------------- | ----------------------------------------------- |
| `models/User.js`                | Added `refreshToken` field                      |
| `services/authService.js`       | Added token generation functions, refresh logic |
| `controllers/authController.js` | Updated responses, added refresh controller     |
| `routes/authRoutes.js`          | Added `/refresh-token` route                    |
| `documentation-api.md`          | Updated with token flow and refresh endpoint    |

---

## ✅ Checklist

- [x] User model updated with refreshToken field
- [x] Token generation functions created
- [x] Login returns both tokens
- [x] Register returns both tokens
- [x] Refresh token endpoint implemented
- [x] Logout invalidates refresh token
- [x] Error handling for token scenarios
- [x] API documentation updated
- [x] No linter errors

---

## 🚀 Next Steps (Optional Enhancements)

1. **Token Rotation** - Issue new refresh token on each refresh
2. **Redis Token Store** - Store refresh tokens in Redis for better performance
3. **Token Blacklist** - Blacklist compromised tokens
4. **Rate Limiting** - Limit refresh token endpoint calls
5. **Device Tracking** - Track which devices have active refresh tokens
6. **Multiple Sessions** - Allow users to see and revoke active sessions

---

## 📝 Notes

- The system gracefully falls back to `JWT_SECRET` if `JWT_REFRESH_SECRET` is not set
- Access token expiration is set to 15 minutes (configurable)
- Refresh token expiration is set to 7 days (configurable)
- All tokens are validated against the database on use
- Logout clears the refresh token from the database, making it invalid

---

**Implementation completed on:** October 23, 2025  
**Status:** ✅ Production Ready

