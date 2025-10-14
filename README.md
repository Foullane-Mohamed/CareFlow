# CareFlow

EHR (Electronic Health Record) destiné à des cliniques et cabinets

## Description

CareFlow is a modern Electronic Health Record (EHR) system designed for clinics and medical practices. It provides secure authentication and role-based access control for healthcare professionals.

## Features

- **User Authentication**: Secure JWT-based authentication
- **Role-Based Access Control**: Support for multiple user roles (admin, doctor, nurse, patient, secretary)
- **RESTful API**: Clean and well-structured API endpoints
- **MongoDB Database**: Scalable NoSQL database for storing medical records
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Prerequisites

- Node.js 18+ or Docker
- MongoDB 7.0+ (if running locally)

## Installation

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/Foullane-Mohamed/CareFlow.git
cd CareFlow
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start MongoDB (if running locally)

6. Run the application:

```bash
npm start
```

### Using Docker

1. Make sure Docker and Docker Compose are installed

2. Create `.env` file:

```bash
cp .env.example .env
```

3. Start the application with Docker Compose:

```bash
docker-compose up -d
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

#### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "role": "doctor"
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
    "role": "doctor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
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
    "role": "doctor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get User Profile (Protected)

```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**

```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "doctor",
    "isActive": true,
    "createdAt": "2025-10-13T..."
  }
}
```

## User Roles

- `admin`: Full system access
- `doctor`: Medical staff with elevated privileges
- `nurse`: Medical staff
- `patient`: Patient access
- `secretary`: Administrative staff

## Environment Variables

- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Server port (default: 3000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Project Structure

```
CareFlow/
├── config/           # Database configuration
├── controllers/      # Request handlers
├── middlewares/      # Authentication and error handling
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── compose.yaml     # Docker Compose configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

## Author

Foullane Mohamed
