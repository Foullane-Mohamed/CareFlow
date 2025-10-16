# CareFlow EHR API Documentation

## Authentication & Authorization

### Public Registration (Patient Only)

**POST** `/api/auth/register`

**Description:** Public endpoint for patient registration. All registered users will be assigned the "patient" role regardless of the role parameter sent.

**Authorization:** None (Public)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User registered successfully as patient",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "patient"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Create User (Admin Only)

**POST** `/api/auth/users`

**Description:** Admin-only endpoint to create users with specific roles (admin, doctor, infirmier, secretary, patient).

**Authorization:** Required (Bearer token)

**Permission:** `CREATE_USER` - Only accessible by `admin` role

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**

```json
{
  "name": "Dr. Jane Smith",
  "email": "jane.smith@clinic.com",
  "password": "securePassword123",
  "role": "doctor"
}
```

**Allowed Roles:** `admin`, `doctor`, `infirmier`, `secretary`, `patient`

**Response:**

```json
{
  "message": "User created successfully by administrator",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Dr. Jane Smith",
    "email": "jane.smith@clinic.com",
    "role": "doctor",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Login User

**POST** `/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## Get User Profile

**GET** `/api/auth/profile`

**Response:**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "doctor",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Create Patient

**POST** `/api/patients`

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "contact": "+1234567890",
  "insurance": "BlueCross BlueShield",
  "allergies": ["Penicillin", "Peanuts"],
  "medicalHistory": ["Diabetes Type 2"],
  "consent": true
}
```

---

## Get All Patients

**GET** `/api/patients`

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "contact": "+1234567890",
    "insurance": "BlueCross BlueShield",
    "allergies": ["Penicillin", "Peanuts"],
    "medicalHistory": ["Diabetes Type 2"],
    "consent": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## Get Patient By ID

**GET** `/api/patients/:id`

---

## Update Patient

**PUT** `/api/patients/:id`

**Request Body:**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "contact": "+1234567890",
  "insurance": "Aetna",
  "allergies": ["Penicillin", "Peanuts", "Latex"],
  "medicalHistory": ["Diabetes Type 2", "Hypertension"],
  "consent": true
}
```

---

## Delete Patient

**DELETE** `/api/patients/:id`

---

## Logout User

**POST** `/api/auth/logout`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

---

## Create Appointment

**POST** `/api/appointments`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Request Body:**

```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2024-02-15",
  "heure": "14:30"
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": "507f1f77bcf86cd799439012",
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2024-02-15T00:00:00.000Z",
  "heure": "14:30",
  "statut": "scheduled",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Get All Appointments

**GET** `/api/appointments`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Query Parameters (Optional):**

- `doctorId` - Filter by doctor ID
- `patientId` - Filter by patient ID
- `date` - Filter by date (YYYY-MM-DD)
- `statut` - Filter by status (scheduled, completed, cancelled)

**Example:**

```
GET /api/appointments?doctorId=507f1f77bcf86cd799439011&date=2024-02-15
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "patientId": {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "contact": "+1234567890"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "date": "2024-02-15T00:00:00.000Z",
    "heure": "14:30",
    "statut": "scheduled",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## Get Appointment By ID

**GET** `/api/appointments/:id`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "contact": "+1234567890",
    "dateOfBirth": "1990-05-15T00:00:00.000Z"
  },
  "doctorId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "doctor"
  },
  "date": "2024-02-15T00:00:00.000Z",
  "heure": "14:30",
  "statut": "scheduled",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Update Appointment

**PUT** `/api/appointments/:id`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Request Body:**

```json
{
  "patientId": "507f1f77bcf86cd799439012",
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2024-02-15",
  "heure": "15:00",
  "statut": "scheduled"
}
```

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "contact": "+1234567890"
  },
  "doctorId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "date": "2024-02-15T00:00:00.000Z",
  "heure": "15:00",
  "statut": "scheduled",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

## Delete Appointment

**DELETE** `/api/appointments/:id`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Response:**

```json
{
  "message": "Appointment deleted successfully"
}
```

---

## Complete Appointment

**PATCH** `/api/appointments/:id/complete`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Description:**
Mark an appointment as completed. Only doctors can complete appointments.

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": "507f1f77bcf86cd799439012",
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2024-02-15T00:00:00.000Z",
  "heure": "14:30",
  "statut": "completed",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

---

## Cancel Appointment

**PATCH** `/api/appointments/:id/cancel`

**Headers:**

```
Authorization: Bearer <your_token>
```

**Description:**
Cancel an appointment. Available to admin, doctor, secretary, and the patient who owns the appointment.

**Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": "507f1f77bcf86cd799439012",
  "doctorId": "507f1f77bcf86cd799439011",
  "date": "2024-02-15T00:00:00.000Z",
  "heure": "14:30",
  "statut": "cancelled",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

---

## Role-Based Access Control (RBAC)

### User Roles

- `admin` - Full system access, can create users with any role
- `doctor` - Medical staff with elevated privileges
- `infirmier` - Nurse with patient access
- `patient` - Patient with limited access (self-registration only)
- `secretary` - Administrative staff

### Registration & User Creation

- **Public Registration:** Anyone can register via `POST /api/auth/register` - automatically assigned `patient` role
- **Admin User Creation:** Only `admin` role can create users with specific roles via `POST /api/auth/users`

### Permission Matrix

#### Authentication Permissions

- **CREATE_USER**: admin

#### Patient Permissions

- **CREATE_PATIENT**: admin, doctor, infirmier, secretary
- **VIEW_PATIENTS**: admin, doctor, infirmier, secretary
- **UPDATE_PATIENT**: admin, doctor, infirmier
- **MANAGE_PATIENTS** (delete): admin only

#### Appointment Permissions

- **CREATE_APPOINTMENT**: admin, doctor, secretary, patient
- **VIEW_APPOINTMENTS**: admin, doctor, secretary, patient
- **UPDATE_APPOINTMENT**: admin, doctor, secretary
- **MANAGE_APPOINTMENTS** (delete): admin, secretary
- **COMPLETE_APPOINTMENT**: doctor only
- **CANCEL_APPOINTMENT**: admin, doctor, secretary, patient

#### User Management Permissions

- **MANAGE_USERS**: admin
- **VIEW_USERS**: admin, secretary

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "message": "No token provided"
}
```

### 403 Forbidden

```json
{
  "message": "Forbidden: You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 409 Conflict

```json
{
  "message": "Doctor or patient not available at this time"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```
