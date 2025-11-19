# 🏥 CareFlow API Documentation

**Base URL:** `http://localhost:3000`  
**Authentication:** `Authorization: Bearer <token>`

---

## 📑 Table of Contents

1. [Authentication](#-authentication)
2. [Admin APIs](#-admin-apis)
3. [Doctor APIs](#-doctor-apis)
4. [Infirmier APIs](#-infirmier-apis)
5. [Secretary APIs](#-secretary-apis)
6. [Patient APIs](#-patient-apis)
7. [Response Codes](#-response-codes)
8. [Frontend Guide](#-frontend-implementation-guide)

---

## 🔐 Authentication

### Register (Patient Only)

```http
POST /api/auth/register
Content-Type: application/json
```

```json
{ "name": "John Doe", "email": "john@example.com", "password": "Pass123!" }
→ Returns: { accessToken, refreshToken, user: { id, name, email, role } }
```

### Login (All Roles)

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{ "email": "user@example.com", "password": "Pass123!" }
→ Returns: { accessToken, refreshToken, user: { id, name, email, role } }
```

### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer <token>
→ Returns: { id, name, email, role }
```

### Refresh Token

```http
POST /api/auth/refresh-token
Authorization: Bearer <refreshToken>
→ Returns: { accessToken }
```

### Request Password Reset

```http
POST /api/auth/request-reset
Content-Type: application/json
```

```json
{ "email": "user@example.com" }
→ Returns: { message: "Reset email sent" }
```

### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json
```

```json
{ "token": "reset_token_from_email", "newPassword": "NewPass123!" }
→ Returns: { message: "Password reset successful" }
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
→ Returns: { message: "Logged out successfully" }
```

---

## 👨‍💼 Admin APIs

**Access Level:** Full access to all system operations

### User Management

#### Create User (Doctor/Infirmier/Secretary)

```http
POST /api/auth/users
Authorization: Bearer <adminToken>
```

```json
{
  "name": "Dr. Ahmed Hassan",
  "email": "doctor@careflow.com",
  "password": "Doctor123!",
  "role": "doctor"
}
```

_Roles: `doctor` | `infirmier` | `secretary`_

### Patient Management

```http
POST   /api/patients                # Create patient
GET    /api/patients                # Get all patients
GET    /api/patients/:id            # Get patient by ID
PUT    /api/patients/:id            # Update patient
DELETE /api/patients/:id            # Delete patient
```

**Patient Body Example:**

```json
{
  "firstName": "Youssef",
  "lastName": "Cherif",
  "dateOfBirth": "1985-03-20",
  "contact": "+212612345678",
  "insurance": "CNSS",
  "allergies": ["Penicillin"],
  "medicalHistory": ["Diabetes"],
  "consent": true
}
```

### Appointment Management

```http
GET    /api/appointments            # Get all appointments
DELETE /api/appointments/:id        # Delete appointment
```

### Medical Records Management

```http
GET    /api/v1/medical-records             # Get all medical records
GET    /api/v1/medical-records/:id         # Get by ID
DELETE /api/v1/medical-records/:id         # Delete record
```

### Consultation Management

```http
DELETE /api/v1/consultations/:id           # Delete consultation
```

---

## 👨‍⚕️ Doctor APIs

**Access Level:** Manage patients, appointments, medical records, and consultations

### What Doctors Can Do:

- ✅ Create/View/Update patients
- ✅ Create/View/Update/Complete/Cancel appointments
- ✅ Create/View/Update medical records
- ✅ Create/View/Update/Complete consultations
- ❌ Cannot delete patients or medical records

### Patient APIs

```http
POST   /api/patients                # Create patient
GET    /api/patients                # View all patients
GET    /api/patients/:id            # Get patient by ID
PUT    /api/patients/:id            # Update patient
```

### Appointment APIs

```http
POST   /api/appointments            # Create appointment
GET    /api/appointments            # Get all appointments
GET    /api/appointments/:id        # Get appointment by ID
PUT    /api/appointments/:id        # Update appointment
PATCH  /api/appointments/:id/cancel    # Cancel appointment
PATCH  /api/appointments/:id/complete  # Mark as completed
```

**Appointment Body:**

```json
{
  "patientId": "patient_id",
  "doctorId": "doctor_id",
  "date": "2025-11-20",
  "heure": "09:00"
}
```

### Medical Records APIs

```http
POST   /api/v1/medical-records                  # Create medical record
GET    /api/v1/medical-records/patient/:id      # Get patient's records
GET    /api/v1/medical-records/:id              # Get by ID
PUT    /api/v1/medical-records/:id              # Update record
```

**Medical Record Body:**

```json
{
  "patientId": "patient_id",
  "patientInfo": {
    "name": "Patient Name",
    "age": 32,
    "gender": "male",
    "contact": "+212...",
    "insurance": "CNSS"
  },
  "allergies": ["Aspirin"],
  "medicalHistory": ["Asthma"],
  "currentMedications": ["Ventolin Inhaler"],
  "labResults": [
    {
      "title": "Blood Test",
      "result": "Normal",
      "date": "2025-11-01"
    }
  ],
  "notes": "Patient condition notes...",
  "consent": true
}
```

### Consultation APIs

```http
POST   /api/v1/consultations                       # Create consultation
GET    /api/v1/consultations                       # Get all consultations
GET    /api/v1/consultations/doctor/:doctorId     # Get doctor's consultations
GET    /api/v1/consultations/:id                  # Get by ID
PUT    /api/v1/consultations/:id                  # Update consultation
PATCH  /api/v1/consultations/:id/complete         # Mark as completed
```

**Consultation Body:**

```json
{
  "appointmentId": "appointment_id",
  "patientId": "patient_id",
  "medicalRecordId": "medical_record_id",
  "vitalSigns": {
    "bloodPressure": "120/80",
    "heartRate": 72,
    "temperature": 36.8,
    "weight": 70,
    "height": 175,
    "respiratoryRate": 16,
    "oxygenSaturation": 98
  },
  "diagnosis": "Diagnosis text...",
  "procedures": ["Procedure 1", "Procedure 2"],
  "notes": "Consultation notes...",
  "status": "completed"
}
```

---

## 👩‍⚕️ Infirmier APIs

**Access Level:** Manage patients and appointments, view consultations

### What Infirmiers Can Do:

- ✅ Create/View patients
- ✅ Create/View/Update/Cancel appointments
- ✅ View consultations
- ❌ Cannot update patients
- ❌ Cannot complete appointments
- ❌ Cannot create/modify medical records or consultations

### Patient APIs

```http
POST   /api/patients                # Create patient
GET    /api/patients                # View all patients
GET    /api/patients/:id            # Get patient by ID
```

### Appointment APIs

```http
POST   /api/appointments            # Create appointment
GET    /api/appointments            # Get all appointments
PUT    /api/appointments/:id        # Update appointment
PATCH  /api/appointments/:id/cancel # Cancel appointment
```

### Consultation APIs (Read-only)

```http
GET    /api/v1/consultations        # View all consultations
```

---

## 👩‍💼 Secretary APIs

**Access Level:** Manage patients and appointments (administrative support)

### What Secretaries Can Do:

- ✅ Create/View patients
- ✅ Create/View/Update/Cancel/Delete appointments
- ❌ Cannot update patients
- ❌ Cannot view consultations
- ❌ Cannot access medical records

### Patient APIs

```http
POST   /api/patients                # Create patient
GET    /api/patients                # View all patients
GET    /api/patients/:id            # Get patient by ID
```

### Appointment APIs (Full Control)

```http
POST   /api/appointments            # Create appointment
GET    /api/appointments            # Get all appointments
GET    /api/appointments/:id        # Get appointment by ID
PUT    /api/appointments/:id        # Update appointment
PATCH  /api/appointments/:id/cancel # Cancel appointment
DELETE /api/appointments/:id        # Delete appointment
```

---

## 👤 Patient APIs

**Access Level:** View and manage own data only

### What Patients Can Do:

- ✅ View own profile
- ✅ Create/View/Cancel own appointments
- ✅ View own medical records
- ✅ View own consultations
- ❌ Cannot create other patients
- ❌ Cannot view other patients' data
- ❌ Cannot update/complete appointments

### Profile API

```http
GET    /api/auth/profile            # Get my profile
```

### Appointment APIs (Own appointments only)

```http
POST   /api/appointments                      # Create appointment for myself
GET    /api/appointments?patientId=my_id     # Get my appointments
PATCH  /api/appointments/:id/cancel          # Cancel my appointment
```

### Medical Records APIs (Read-only)

```http
GET    /api/v1/medical-records/patient/:myId  # Get my medical records
```

### Consultation APIs (Read-only)

```http
GET    /api/v1/consultations/patient/:myId    # Get my consultations
```

---

## 📊 Response Codes

| Code | Meaning      | Description                              |
| ---- | ------------ | ---------------------------------------- |
| 200  | OK           | Request successful                       |
| 201  | Created      | Resource created successfully            |
| 400  | Bad Request  | Invalid input or validation error        |
| 401  | Unauthorized | Missing or invalid authentication token  |
| 403  | Forbidden    | Insufficient permissions for this action |
| 404  | Not Found    | Resource not found                       |
| 500  | Server Error | Internal server error                    |

### Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error description",
  "statusCode": 400
}
```

---

## 💻 Frontend Implementation Guide

### Token Management

```typescript
// After login/register
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
localStorage.setItem("user", JSON.stringify(response.user));

// For API calls
const headers = {
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  "Content-Type": "application/json",
};

// Handle token expiration
if (error.status === 401) {
  const newToken = await refreshAccessToken();
  // Retry the failed request
}
```

### Refresh Token Function

```typescript
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await fetch("http://localhost:3000/api/auth/refresh-token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  const data = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}
```

### Query Parameters Examples

```javascript
// Pagination
GET /api/patients?page=1&limit=10

// Filtering by date
GET /api/appointments?date=2025-11-20

// Filter by status
GET /api/appointments?status=scheduled

// Filter by doctor
GET /api/appointments?doctorId=doctor_id

// Patient's own appointments
GET /api/appointments?patientId=my_patient_id
```

### Date Format

All dates must be in **ISO 8601 format**: `YYYY-MM-DD`

```javascript
const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

// Example: "2025-11-12"
```

### Role-Based UI Rendering

```typescript
const user = JSON.parse(localStorage.getItem("user"));

if (user.role === "admin") {
  // Show all features
} else if (user.role === "doctor") {
  // Show doctor features: patients, appointments, medical records, consultations
} else if (user.role === "infirmier") {
  // Show: patients (view), appointments, consultations (view)
} else if (user.role === "secretary") {
  // Show: patients (view), appointments
} else if (user.role === "patient") {
  // Show: own profile, own appointments, own records
}
```

### API Call Example (Axios)

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshAccessToken();
        return api.request(error.config);
      } catch {
        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Usage in Components

```typescript
// Get all patients (Doctor/Infirmier/Secretary)
const patients = await api.get("/api/patients");

// Create appointment
const appointment = await api.post("/api/appointments", {
  patientId: "patient_id",
  doctorId: "doctor_id",
  date: "2025-11-20",
  heure: "09:00",
});

// Get patient's medical records
const records = await api.get(`/api/v1/medical-records/patient/${patientId}`);
```

---

## 🎯 Quick Role Reference

### 👨‍💼 **Admin**

Full system access. Can create users, manage all resources, and delete records.

### 👨‍⚕️ **Doctor**

Full clinical access. Manages patients, appointments, medical records, and consultations. Cannot delete resources.

### 👩‍⚕️ **Infirmier**

Clinical support. Creates patients, manages appointments, views consultations. No medical record or patient update access.

### 👩‍💼 **Secretary**

Administrative support. Creates patients, full appointment management. No access to medical records or consultations.

### 👤 **Patient**

Personal access only. Views own profile, manages own appointments, views own medical records and consultations.

---

## 📝 Important Notes

1. **Token Expiry:** Access tokens expire after 1 hour, refresh tokens after 7 days
2. **Date Format:** Always use `YYYY-MM-DD` for dates
3. **Time Format:** Use `HH:MM` (24-hour format) for appointment times
4. **Insurance Values:** `CNSS` or `CNOPS`
5. **Gender Values:** `male` or `female`
6. **Appointment Status:** `scheduled`, `completed`, or `cancelled`
7. **Consultation Status:** `scheduled`, `completed`, or `cancelled`

---

**Version:** 1.0  
**Last Updated:** November 12, 2025  
**Support:** For issues, contact the backend team
