# CareFlow EHR API Documentation

## Register User

**POST** `/api/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "doctor"
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
