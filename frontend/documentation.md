# 📋 CareFlow Frontend Documentation

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Main Files](#main-files)
4. [API and Integration](#api-and-integration)
5. [Authentication and Storage System](#authentication-and-storage-system)
6. [Routing and Protection System](#routing-and-protection-system)
7. [Services](#services)
8. [Data Types](#data-types)
9. [Pages and Components](#pages-and-components)

---

## 🎯 Project Overview

### Main Objective

**CareFlow** is a comprehensive clinic management system that manages patients, appointments, consultations, and medical records. It provides a user-friendly interface for different roles:

- **Admin**: User management and complete system management
- **Doctor**: Patient management, appointments, and consultations
- **Infirmier (Nurse)**: View patient data and appointments
- **Secretary**: Appointment and user management
- **Patient**: View appointments and medical records

### Technologies Used

- **React 18+**: User interface library
- **TypeScript**: Type-safe programming
- **Zustand**: State Management
- **Axios**: HTTP requests
- **React Router**: Routing and navigation
- **Tailwind CSS**: Interface design

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── api/                      # Server connection configuration
│   ├── components/               # Reusable React components
│   ├── layouts/                  # Page layouts
│   ├── pages/                    # Application pages
│   ├── router/                   # Routing and navigation management
│   ├── services/                 # API communication services
│   ├── store/                    # State management
│   ├── types/                    # TypeScript definitions
│   ├── App.tsx                   # Main component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Static files
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite build tool configuration
```

---

## 📄 Main Files

### 1️⃣ `src/App.tsx`

**File Purpose:**

- Main application component
- Acts as the main entry point containing all other components

```typescript
// Basic structure
function App() {
  return <AppRouter />;
}
```

**Code Purpose:**

- Loads the `AppRouter` component that manages all routing and pages

---

### 2️⃣ `src/main.tsx`

**File Purpose:**

- Application entry point
- Initializes React and connects the application to the DOM

```typescript
// Main components used:
// 1. StrictMode: Helps detect potential issues
// 2. Provider from Redux: Provides global state
// 3. App: Main component
```

**Code Purpose:**

- Application setup and DOM connection
- Activation of Redux Store for state management
- Application of global styles

---

## 🔌 API and Integration

### 📌 `src/api/axiosConfig.ts`

**File Purpose:**

- Configuration of an HTTP client (Axios) to communicate with the server
- Management of authentication tokens and automatic token refresh

**Main Functions:**

#### 1. **Creating Axios Client**

```typescript
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
```

**Purpose:** Set the base server address and default headers

#### 2. **Request Interceptor**

```typescript
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});
```

**Purpose:** Automatically add authentication token to each request

#### 3. **Response Interceptor**

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 error (session expired)
    // Attempt automatic token refresh
    // Retry the request with new token
  }
);
```

**Purpose:**

- Detect session expiration (401)
- Automatically request a new authentication token
- Retry the original request
- Redirect user to login page if refresh fails

---

## 🔐 Authentication and Storage System

### 📌 `src/store/authStore.ts`

**File Purpose:**

- Manages authentication and user state
- Stores important data in local storage (Session Storage)

**Main Functions:**

#### 1. **`login(user, accessToken, refreshToken)`**

```typescript
// Login user and save authentication data
const { login } = useAuthStore();
login(userData, accessToken, refreshToken);
```

**Purpose:**

- Save user data
- Store authentication and refresh tokens

#### 2. **`logout()`**

```typescript
// Logout user and delete data
const { logout } = useAuthStore();
logout();
```

**Purpose:** Clear all authentication and user data

#### 3. **`setTokens(accessToken)`**

```typescript
// Update authentication token (when refreshed)
const { setTokens } = useAuthStore();
setTokens(newAccessToken);
```

**Purpose:** Update new authentication token after expiration

#### 4. **Storage Management**

```typescript
// Uses Session Storage (deleted when browser closes)
storage: {
  getItem: (name) => sessionStorage.getItem(name),
  setItem: (name, value) => sessionStorage.setItem(name, value),
  removeItem: (name) => sessionStorage.removeItem(name),
}
```

**Purpose:** Store data securely only in the session

---

## 🛣️ Routing and Protection System

### 📌 `src/router/AppRouter.tsx`

**File Purpose:**

- Defines all application routes
- Links routes to appropriate pages

**Main Routes:**

| Route                        | Page              | Protection     | Allowed Roles           |
| ---------------------------- | ----------------- | -------------- | ----------------------- |
| `/login`                     | Login             | GuestRoute     | Visitors only           |
| `/register`                  | Create account    | GuestRoute     | Visitors only           |
| `/dashboard`                 | Home page         | ProtectedRoute | Logged in users         |
| `/dashboard/patients/*`      | Patient management | ProtectedRoute | Admin, Doctor, Infirmier |
| `/dashboard/appointments/*`  | Appointment management | ProtectedRoute | Everyone                |
| `/dashboard/consultations/*` | Consultation management | ProtectedRoute | Admin, Doctor           |
| `/dashboard/records/*`       | Medical records   | ProtectedRoute | Admin, Doctor           |
| `/dashboard/users/*`         | User management   | ProtectedRoute | Admin only              |
| `/request-password-reset`    | Request password reset | GuestRoute | Visitors only           |
| `/reset-password`            | Reset password    | GuestRoute     | Visitors only           |
| `/dashboard/profile`         | User profile      | ProtectedRoute | Logged in users         |

---

### 📌 `src/router/ProtectedRoute.tsx`

**File Purpose:**

- Protects routes that require login

```typescript
export default function ProtectedRoute({ children }: Props) {
  const { accessToken } = useAuthStore();

  // If no token, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

**Purpose:**

- Check for authentication token
- Prevent access to protected routes without login
- Automatic redirect to login page

---

### 📌 `src/router/GuestRoute.tsx`

**File Purpose:**

- Protects routes for visitors (without account)
- Prevents logged-in users from accessing them

```typescript
export default function GuestRoute({ children }: Props) {
  const { accessToken } = useAuthStore();

  // If user logged in, redirect to dashboard
  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
```

**Purpose:**

- Prevent logged-in users from accessing login/register pages
- Automatic redirect to dashboard

---

### 📌 `src/router/RoleBasedRoute.tsx`

**File Purpose:**

- Protects routes based on user role

```typescript
export default function RoleBasedRoute({ children, allowedRoles }: RoleRouteProps) {
  const { user } = useAuthStore();

  // Check that user has allowed role
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
```

**Purpose:**

- Check user role
- Allow access only to authorized roles
- Prevent other roles from accessing

---

## 🔧 Services

Services contain all API and data operations. Each service manages a specific entity (Patient, Appointment, etc.).

### 📌 `src/services/patientService.ts`

**File Purpose:**

- All patient management operations

**Main Functions:**

#### 1. **`getAll()`**

```typescript
static async getAll(): Promise<Patient[]>
```

**Purpose:** Retrieve the list of all patients
**Usage:**

```typescript
const patients = await PatientService.getAll();
```

#### 2. **`getById(id)`**

```typescript
static async getById(id: string): Promise<Patient>
```

**Purpose:** Retrieve data for a specific patient
**Parameters:**

- `id`: Patient identifier

#### 3. **`create(patientData)`**

```typescript
static async create(patientData: PatientCreateRequest): Promise<Patient>
```

**Purpose:** Add a new patient
**Parameters:**

- `patientData`: Patient data (name, date of birth, etc.)

#### 4. **`update(id, patientData)`**

```typescript
static async update(id: string, patientData: PatientUpdateRequest): Promise<Patient>
```

**Purpose:** Modify patient data

#### 5. **`delete(id)`**

```typescript
static async delete(id: string): Promise<void>
```

**Purpose:** Delete a patient

---

### 📌 `src/services/appointmentService.ts`

**File Purpose:**

- All appointment management operations

**Main Functions:**

#### 1. **`getAll()`**

```typescript
static async getAll(): Promise<Appointment[]>
```

**Purpose:** Retrieve all appointments

#### 2. **`getById(id)`**

```typescript
static async getById(id: string): Promise<Appointment>
```

**Purpose:** Retrieve details of a specific appointment

#### 3. **`getByPatient(patientId)`**

```typescript
static async getByPatient(patientId: string): Promise<Appointment[]>
```

**Purpose:** Retrieve appointments for a specific patient

#### 4. **`getDoctorsFromAppointments()`**

```typescript
static async getDoctorsFromAppointments(): Promise<Array<{ _id: string; name: string; email: string }>>
```

**Purpose:** Retrieve the list of doctors from all appointments
**Usage:** Populate the doctor list in appointment forms

#### 5. **`create(appointmentData)`**

```typescript
static async create(appointmentData: AppointmentCreateRequest): Promise<Appointment>
```

**Purpose:** Create a new appointment

#### 6. **`update(id, appointmentData)`**

```typescript
static async update(id: string, appointmentData: AppointmentUpdateRequest): Promise<Appointment>
```

**Purpose:** Modify an appointment

#### 7. **`cancel(id)`**

```typescript
static async cancel(id: string): Promise<Appointment>
```

**Purpose:** Cancel an appointment

#### 8. **`complete(id)`**

```typescript
static async complete(id: string): Promise<Appointment>
```

**Purpose:** Mark appointment as completed

#### 9. **`delete(id)`**

```typescript
static async delete(id: string): Promise<void>
```

**Purpose:** Delete an appointment

---

### 📌 `src/services/consultationService.ts`

**File Purpose:**

- All medical consultation management operations

**Main Functions:**

#### 1. **`getAll()`**

```typescript
static async getAll(): Promise<Consultation[]>
```

**Purpose:** Retrieve all consultations

#### 2. **`getById(id)`**

```typescript
static async getById(id: string): Promise<Consultation>
```

**Purpose:** Retrieve details of a specific consultation

#### 3. **`getByDoctor(doctorId)`**

```typescript
static async getByDoctor(doctorId: string): Promise<Consultation[]>
```

**Purpose:** Retrieve consultations for a specific doctor

#### 4. **`getByPatient(patientId)`**

```typescript
static async getByPatient(patientId: string): Promise<Consultation[]>
```

**Purpose:** Retrieve consultations for a specific patient

#### 5. **`create(consultationData)`**

```typescript
static async create(consultationData: ConsultationCreateRequest): Promise<Consultation>
```

**Purpose:** Create a new consultation

#### 6. **`update(id, consultationData)`**

```typescript
static async update(id: string, consultationData: ConsultationUpdateRequest): Promise<Consultation>
```

**Purpose:** Modify a consultation

#### 7. **`complete(id)`**

```typescript
static async complete(id: string): Promise<Consultation>
```

**Purpose:** Complete a consultation and mark status as completed

#### 8. **`delete(id)`**

```typescript
static async delete(id: string): Promise<void>
```

**Purpose:** Delete a consultation

---

### 📌 `src/services/medicalRecordService.ts`

**File Purpose:**

- All medical record management operations

**Main Functions:**

#### 1. **`getAll()`**

```typescript
static async getAll(): Promise<MedicalRecord[]>
```

**Purpose:** Retrieve all medical records

#### 2. **`getById(id)`**

```typescript
static async getById(id: string): Promise<MedicalRecord>
```

**Purpose:** Retrieve a specific medical record

#### 3. **`getByPatient(patientId)`**

```typescript
static async getByPatient(patientId: string): Promise<MedicalRecord[]>
```

**Purpose:** Retrieve medical records for a specific patient

#### 4. **`create(medicalRecordData)`**

```typescript
static async create(medicalRecordData: MedicalRecordCreateRequest): Promise<MedicalRecord>
```

**Purpose:** Create a new medical record

#### 5. **`update(id, medicalRecordData)`**

```typescript
static async update(id: string, medicalRecordData: MedicalRecordUpdateRequest): Promise<MedicalRecord>
```

**Purpose:** Modify a medical record

#### 6. **`delete(id)`**

```typescript
static async delete(id: string): Promise<void>
```

**Purpose:** Delete a medical record

---

### 📌 `src/services/userService.ts`

**File Purpose:**

- All user management operations (for Admin)

**Main Functions:**

#### 1. **`getAll()`**

```typescript
static async getAll(): Promise<User[]>
```

**Purpose:** Retrieve all users (Admin only)

#### 2. **`getById(id)`**

```typescript
static async getById(id: string): Promise<User>
```

**Purpose:** Retrieve data for a specific user

#### 3. **`getByRole(role)`**

```typescript
static async getByRole(role: string): Promise<User[]>
```

**Purpose:** Retrieve users by role
**Example:**

```typescript
const doctors = await UserService.getByRole("doctor");
```

#### 4. **`create(userData)`**

```typescript
static async create(userData: UserCreateRequest): Promise<User>
```

**Purpose:** Create a new user (Admin only)

#### 5. **`update(id, userData)`**

```typescript
static async update(id: string, userData: UserUpdateRequest): Promise<User>
```

**Purpose:** Modify user data

#### 6. **`delete(id)`**

```typescript
static async delete(id: string): Promise<void>
```

**Purpose:** Delete a user

#### 7. **`toggleStatus(id)`**

```typescript
static async toggleStatus(id: string): Promise<User>
```

**Purpose:** Enable/disable a user

#### 8. **`getAllDoctors()`**

```typescript
static async getAllDoctors(): Promise<User[]>
```

**Purpose:** Retrieve the list of doctors (accessible to all)

---

## 📊 Data Types

TypeScript definitions that define the shape of data in the application.

### 📌 `src/types/patient.ts`

```typescript
interface Patient {
  _id: string; // Unique identifier
  firstName: string; // First name
  lastName: string; // Last name
  dateOfBirth: string; // Date of birth
  contact: string; // Contact information (phone/email)
  insurance: string; // Insurance information
}
```

---

### 📌 `src/types/appointment.ts`

```typescript
interface Appointment {
  _id: string;
  patientId:
    | {
        // Patient data or identifier
        _id: string;
        firstName: string;
        lastName: string;
        contact: string;
      }
    | string;
  doctorId:
    | {
        // Doctor data or identifier
        _id: string;
        name: string;
        email: string;
      }
    | string;
  date: string; // Appointment date
  heure: string; // Appointment time (HH:mm)
  status: "scheduled" | "completed" | "cancelled"; // Appointment status
}
```

---

### 📌 `src/types/consultation.ts`

```typescript
interface VitalSigns {
  bloodPressure?: string;    // Blood pressure
  heartRate?: number;        // Heart rate
  temperature?: number;      // Temperature
  weight?: number;           // Weight
  height?: number;           // Height
  respiratoryRate?: number;  // Respiratory rate
  oxygenSaturation?: number; // Oxygen saturation
}

interface Consultation {
  _id: string;
  appointmentId: {...} | string;  // Associated appointment
  patientId: {...} | string;      // Patient
  medicalRecordId?: {...} | string; // Medical record
  vitalSigns?: VitalSigns;        // Vital signs
  diagnosis?: string;             // Diagnosis
  procedures?: string[];          // Medical procedures
  notes?: string;                 // Doctor notes
  status: "draft" | "completed"; // Consultation status
}
```

---

### 📌 `src/types/medicalRecord.ts`

```typescript
interface PatientInfo {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  contact: string;
  insurance?: string;
}

interface LabResult {
  title: string;    // Test name
  result: string;   // Result
  date: string;     // Test date
}

interface MedicalRecord {
  _id: string;
  patientId: {...} | string;
  patientInfo: PatientInfo;
  allergies?: string[];              // Allergies
  medicalHistory?: string[];          // Medical history
  currentMedications?: string[];      // Current medications
  labResults?: LabResult[];           // Laboratory results
  notes?: string;                     // General notes
  consent: boolean;                   // Patient consent
}
```

---

### 📌 `src/types/user.ts`

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "infirmier" | "secretary" | "patient";
  isActive?: boolean;
}
```

---

## 🎨 Pages and Components

### 📌 Layouts

#### `src/layouts/MainLayout.tsx`

**File Purpose:**

- Main application layout after login
- Contains sidebar, navbar, and main content

```typescript
// Structure:
// <div className="flex h-screen overflow-hidden">
//   <Sidebar />      // Sidebar with menu
//   <div className="flex-1 flex flex-col overflow-hidden">
//     <Navbar />     // Top navbar with user info
//     <main>
//       <Outlet />   // Current page content
//     </main>
//     <Footer />     // Footer
//   </div>
// </div>
```

---

#### `src/layouts/Sidebar.tsx`

**File Purpose:**

- Side navigation menu
- Displays different options based on user role

**Features:**

1. **Display menu by role:**
   - **Admin**: Users, patients, appointments, consultations, records
   - **Doctor**: Patients, appointments, consultations, records
   - **Nurse**: Patients, appointments, consultations
   - **Secretary**: (to be updated)
   - **Patient**: (to be updated)

2. **Active link highlighting:**
   ```typescript
   const isActive = (path: string) => {
     return location.pathname === path;
   };
   ```
   Shows current link in a different blue color

3. **Profile link for all users:**
   ```typescript
   <Link to="/dashboard/profile" className="text-sm text-blue-600 hover:text-blue-700">
     My Profile
   </Link>
   ```

---

#### `src/layouts/Navbar.tsx`

**File Purpose:**

- Top navigation bar
- Display user data
- Logout button

**Functions:**

##### `handleLogout()`

```typescript
const handleLogout = async () => {
  try {
    await api.post("/api/auth/logout"); // Inform server
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    logout(); // Clear local data
    navigate("/login"); // Go to login page
  }
};
```

**Purpose:** Secure user logout

---

### 📌 Authentication Pages

#### `src/pages/auth/LoginPage.tsx`

**File Purpose:**

- Login form
- Verify user data and secure login

**States:**

```typescript
const [email, setEmail] = useState(""); // User email
const [password, setPassword] = useState(""); // Password
const [error, setError] = useState(""); // Error messages
const [loading, setLoading] = useState(false); // Loading state
```

**Main Function:**

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");

    // Send login data to server
    const res = await api.post("/api/auth/login", { email, password });

    // Extract response data
    const { accessToken, refreshToken, user } = res.data;

    // Save authentication data
    login(user, accessToken, refreshToken);

    // Go to dashboard
    navigate("/dashboard");
  } catch (err: any) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
```

**Purpose:**

1. Validate input data
2. Send data to server
3. Save authentication tokens
4. Redirect user to dashboard

**New Feature:**

```typescript
<Link
  to="/request-password-reset"
  className="text-sm text-blue-600 hover:text-blue-700"
>
  Forgot password?
</Link>
```

**Purpose:** Link to password reset flow

---

#### `src/pages/auth/RegisterPage.tsx`

**File Purpose:**

- User account creation form
- Register a new user

**States:**

```typescript
const [name, setName] = useState(""); // Username
const [email, setEmail] = useState(""); // Email
const [password, setPassword] = useState(""); // Password
const [error, setError] = useState(""); // Error messages
const [loading, setLoading] = useState(false); // Loading state
```

**Main Function:**

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");

    // Send registration data
    const res = await api.post("/api/auth/register", { name, email, password });

    // Save local data (should use authStore instead)
    const { accessToken, refreshToken, user } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    // Go to dashboard
    navigate("/dashboard");
  } catch (err: any) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};
```

---

#### `src/pages/auth/RequestPasswordReset.tsx`

**File Purpose:**

- Password reset request form
- Sends password reset email to user

**States:**

```typescript
const [email, setEmail] = useState("");           // User email
const [loading, setLoading] = useState(false);     // Loading state
const [error, setError] = useState("");            // Error messages
const [success, setSuccess] = useState(false);     // Success state
```

**Main Function:**

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  if (!email.trim()) {
    setError("Please enter your email address");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess(false);

    await api.post("/api/auth/request-reset", { email });
    
    setSuccess(true);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to send reset email");
  } finally {
    setLoading(false);
  }
};
```

**Purpose:**

1. Validate email input
2. Send reset request to server
3. Display success message
4. User receives email with reset token

---

#### `src/pages/auth/ResetPassword.tsx`

**File Purpose:**

- Password reset form with token validation
- Allows user to set new password

**States:**

```typescript
const [newPassword, setNewPassword] = useState("");         // New password
const [confirmPassword, setConfirmPassword] = useState(""); // Password confirmation
const [loading, setLoading] = useState(false);              // Loading state
const [error, setError] = useState("");                     // Error messages
const [success, setSuccess] = useState(false);              // Success state
```

**Main Function:**

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!token) {
    setError("Invalid reset token");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  if (newPassword.length < 6) {
    setError("Password must be at least 6 characters long");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await api.post("/api/auth/reset-password", {
      token,
      newPassword,
    });

    setSuccess(true);
    
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to reset password");
  } finally {
    setLoading(false);
  }
};
```

**Purpose:**

1. Extract token from URL query parameters
2. Validate password match and strength
3. Send new password to server
4. Redirect to login page on success

---

### 📌 Profile Pages

#### `src/pages/profile/Profile.tsx`

**File Purpose:**

- Display current user's profile information
- Shows user details and account status

**States:**

```typescript
const [profile, setProfile] = useState<User | null>(null);  // User profile data
const [loading, setLoading] = useState(true);               // Loading state
const [error, setError] = useState("");                     // Error messages
```

**Main Function:**

##### `fetchProfile()`

```typescript
const fetchProfile = async () => {
  try {
    setLoading(true);
    setError("");
    const response = await api.get("/api/auth/profile");
    setProfile(response.data);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch profile");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProfile();
}, []);
```

**Purpose:**

- Fetch current user's profile from server
- Display user information (name, email, role, status, ID)
- Show role badge with color coding
- Display account status (Active/Inactive)

**Features:**

1. **Role Badge Display:**
   ```typescript
   const getRoleBadge = (role: string) => {
     const roleColors = {
       admin: "bg-purple-100 text-purple-800",
       doctor: "bg-blue-100 text-blue-800",
       infirmier: "bg-green-100 text-green-800",
       secretary: "bg-yellow-100 text-yellow-800",
       patient: "bg-gray-100 text-gray-800",
     };
     return roleColors[role] || "bg-gray-100 text-gray-800";
   };
   ```

2. **Status Badge Display:**
   ```typescript
   const getStatusBadge = (isActive?: boolean) => {
     return isActive === false
       ? "bg-red-100 text-red-800"
       : "bg-green-100 text-green-800";
   };
   ```

---

### 📌 Dashboard Pages

#### `src/pages/dashboard/DashboardHome.tsx`

**File Purpose:**

- Main page after login
- Display basic user information

**Content:**

- Display current user role
- (Can be improved to display statistics and reports)

---

---

### 📌 User Management Pages

#### `src/pages/users/UsersList.tsx`

**File Purpose:**

- Display list of all users (Admin only)
- Manage user accounts and permissions

**States:**

```typescript
const [users, setUsers] = useState<User[]>([]);              // List of users
const [loading, setLoading] = useState(true);                // Loading state
const [error, setError] = useState("");                      // Error messages
const [filterRole, setFilterRole] = useState<string>("all"); // Role filter
const [toggleLoading, setToggleLoading] = useState<string | null>(null); // Toggle loading state
```

**Main Functions:**

##### `fetchUsers()`

```typescript
const fetchUsers = async () => {
  try {
    setLoading(true);
    setError("");
    const usersData = await UserService.getAll();
    setUsers(usersData);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch users");
  } finally {
    setLoading(false);
  }
};
```

##### `handleToggleStatus(userId)`

```typescript
const handleToggleStatus = async (userId: string) => {
  try {
    setToggleLoading(userId);
    setError("");
    await UserService.toggleStatus(userId);
    await fetchUsers();
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to toggle user status");
  } finally {
    setToggleLoading(null);
  }
};
```

**Purpose:**

- Display all system users with their roles and status
- Filter users by role
- Toggle user active/inactive status
- Role-based badge display
- CRUD operations (Create, Read, Update, Delete)

**Features:**

1. **Role Filtering:**
   - Filter by: All, Admin, Doctor, Nurse, Secretary, Patient
   
2. **User Status Toggle:**
   - Activate/Deactivate user accounts
   - Shows loading state during toggle
   
3. **Role Badge Colors:**
   - Admin: Purple
   - Doctor: Blue
   - Nurse: Green
   - Secretary: Yellow
   - Patient: Gray

---

#### `src/pages/users/UserCreate.tsx`

**File Purpose:**

- Create new user accounts (Admin only)
- Supports creating doctors, nurses, and secretaries

**States:**

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [formData, setFormData] = useState<UserFormData>({
  name: "",
  email: "",
  password: "",
  role: "doctor",
});
```

**Main Function:**

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    await UserService.create(formData);
    navigate("/dashboard/users");
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to create user");
  } finally {
    setLoading(false);
  }
};
```

**Features:**

- Role selection dropdown
- Password strength validation
- Email validation
- Auto-generated user ID

---

#### `src/pages/users/UserEdit.tsx`

**File Purpose:**

- Edit existing user information
- Update user role and details

**Purpose:**

- Fetch user data by ID
- Update user name, email, role
- Option to update password
- Validation before submission

---

#### `src/pages/users/UserDetail.tsx`

**File Purpose:**

- Display detailed user information
- View user profile and account status

**Features:**

- Show all user details
- Display role and status badges
- Show creation and last update dates
- Action buttons (Edit, Delete)

---

#### `src/pages/users/UserDelete.tsx`

**File Purpose:**

- Confirm and delete user account
- Safety confirmation before deletion

**Features:**

- Display user information before deletion
- Confirmation prompt
- Cascade deletion handling
- Return to user list after deletion

---

### 📌 Consultation Pages (Updated)

#### Status System Update

**Important Change:**

The consultation status has been updated to match backend validation:

```typescript
// OLD (incorrect)
status: "pending" | "completed"

// NEW (correct)
status: "draft" | "completed"
```

**Status Meanings:**

1. **Draft** (Yellow Badge):
   - Work in progress
   - Can be edited
   - Not finalized

2. **Completed** (Green Badge):
   - Finalized consultation
   - Cannot be edited
   - Locked for data integrity

---

#### `src/pages/consultations/ConsultationCreate.tsx`

**File Purpose:**

- Create new medical consultation
- Record patient visit details

**States:**

```typescript
const [loading, setLoading] = useState(false);
const [loadingData, setLoadingData] = useState(true);
const [error, setError] = useState("");
const [patients, setPatients] = useState<Patient[]>([]);
const [appointments, setAppointments] = useState<Appointment[]>([]);
const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
const [procedures, setProcedures] = useState<string[]>([""]);
const [formData, setFormData] = useState<ConsultationFormData>({
  appointmentId: "",
  patientId: "",
  medicalRecordId: "",
  vitalSigns: { /* ... */ },
  diagnosis: "",
  procedures: [],
  notes: "",
  status: "draft",  // Default status
});
```

**Key Features:**

##### 1. **Data Loading on Mount**

```typescript
useEffect(() => {
  const fetchData = async () => {
    try {
      const [patientsData, appointmentsData, medicalRecordsData] = 
        await Promise.all([
          PatientService.getAll(),
          AppointmentService.getAll(),
          MedicalRecordService.getAll(),
        ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setMedicalRecords(medicalRecordsData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load data");
    }
  };

  fetchData();
}, []);
```

**Purpose:** Load all appointments, patients, and medical records in parallel

##### 2. **Appointment Display**

```typescript
const getAppointmentDisplay = (appointment: Appointment) => {
  const patientName = getPatientName(appointment);
  const date = new Date(appointment.date).toLocaleDateString();
  const time = appointment.heure;
  const status = appointment.status?.toUpperCase() || "N/A";
  
  return `${patientName} - ${date} at ${time} [${status}]`;
};
```

**Purpose:** Display appointments with patient name, date, time, and status

##### 3. **Medical Record Selection**

```typescript
<select name="medicalRecordId" value={formData.medicalRecordId}>
  <option value="">
    {medicalRecords.length === 0 
      ? "No medical records available" 
      : "Select a medical record (optional)"}
  </option>
  {medicalRecords.map((record) => {
    const patientName = typeof record.patientId === "object"
      ? `${record.patientId.firstName} ${record.patientId.lastName}`
      : record.patientInfo.name;
    const recordDate = new Date(record.createdAt || "").toLocaleDateString();
    return (
      <option key={record._id} value={record._id}>
        {patientName} - {recordDate} - ID: {record._id.slice(-6)}
      </option>
    );
  })}
</select>
```

**Purpose:** 
- Select existing medical records from dropdown
- No need to manually enter record ID
- Shows patient name and creation date

##### 4. **Vital Signs Input**

```typescript
vitalSigns: {
  bloodPressure: "",        // e.g., "120/80"
  heartRate: undefined,     // bpm
  temperature: undefined,   // °C
  weight: undefined,        // kg
  height: undefined,        // cm
  respiratoryRate: undefined, // bpm
  oxygenSaturation: undefined, // %
}
```

##### 5. **Status Selection**

```typescript
<select name="status" required>
  <option value="draft">Draft</option>
  <option value="completed">Completed</option>
</select>
```

**Helper Text:** "Set to 'Draft' to save for later, or 'Completed' to finalize the consultation"

##### 6. **Dynamic Procedures**

```typescript
const handleProcedureChange = (index: number, value: string) => {
  const newProcedures = [...procedures];
  newProcedures[index] = value;
  setProcedures(newProcedures);
};

const addProcedure = () => {
  setProcedures([...procedures, ""]);
};

const removeProcedure = (index: number) => {
  const newProcedures = procedures.filter((_, i) => i !== index);
  setProcedures(newProcedures.length ? newProcedures : [""]);
};
```

**Purpose:** Add/remove multiple procedures dynamically

---

#### `src/pages/consultations/ConsultationEdit.tsx`

**File Purpose:**

- Edit existing consultation
- Update consultation details

**Similar Features to Create:**
- All same inputs and validations
- Pre-fills data from existing consultation
- Maintains consultation status workflow
- Medical record dropdown selection

**Key Difference:**
- Fetches existing consultation data on mount
- Updates instead of creates

---

#### `src/pages/consultations/ConsultationsList.tsx`

**File Purpose:**

- Display consultations based on user role
- Manage consultation lifecycle

**Role-Based Data Loading:**

```typescript
if (user?.role === "patient" && user?._id) {
  // Patient sees only their consultations
  const consultationsData = await ConsultationService.getByPatient(user._id);
} else if (user?.role === "doctor" && user?._id) {
  // Doctor sees their consultations
  const consultationsData = await ConsultationService.getByDoctor(user._id);
} else {
  // Admin sees all consultations
  const consultationsData = await ConsultationService.getAll();
}
```

**Permission Functions:**

```typescript
const canEdit = (consultation: Consultation) => {
  return (
    ["admin", "doctor"].includes(user?.role || "") &&
    consultation.status === "draft"  // Only draft can be edited
  );
};

const canComplete = (consultation: Consultation) => {
  return (
    ["admin", "doctor"].includes(user?.role || "") &&
    consultation.status === "draft"  // Only draft can be completed
  );
};

- Display detailed consultation information
- View all consultation data

**Features:**

- Display patient information
- Show appointment details
- List vital signs
- Show diagnosis and procedures
- Display consultation notes
- Status badge
- Action buttons (Edit, Complete, Delete) based on permissions

---

#### `src/pages/consultations/ConsultationComplete.tsx`

**File Purpose:**

- Mark consultation as completed
- Finalize consultation workflow

**Function:**

```typescript
const handleComplete = async () => {
  try {
    setLoading(true);
    await ConsultationService.complete(id!);
    navigate("/dashboard/consultations");
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to complete consultation");
  } finally {
    setLoading(false);
  }
};
```

**Purpose:**
- Changes status from "draft" to "completed"
- Locks consultation from further editing
- Returns to consultation list

---

#### `src/pages/consultations/ConsultationDelete.tsx`

**File Purpose:**

- Confirm and delete consultation
- Safety check before deletion

**Features:**

- Display consultation details
- Confirmation prompt
- Delete and redirect to list

---

### 📌 Patient Pages (Completed)

#### `src/pages/patients/PatientsList.tsx`

**File Purpose:**

- Display list of all patients
- Allow viewing, editing, and deletion

**States:**

```typescript
const [patients, setPatients] = useState<Patient[]>([]); // List of patients
const [loading, setLoading] = useState(false); // Loading state
const [error, setError] = useState(""); // Error messages
```

**Main Functions:**

##### `fetchPatients()`

```typescript
const fetchPatients = async () => {
  try {
    setLoading(true);
    setError("");
    const patientsData = await PatientService.getAll();
    setPatients(patientsData);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch patients");
  } finally {
    setLoading(false);
  }
};

// Load data on page open
useEffect(() => {
  fetchPatients();
}, []);
```

**Purpose:** Fetch and display patient list

**Available Operations:**

1. **View details:**

   ```typescript
   navigate(`/dashboard/patients/${patient._id}`);
   ```

2. **Edit:**

   ```typescript
   navigate(`/dashboard/patients/${patient._id}/edit`);
   ```

3. **Delete:**
   ```typescript
   navigate(`/dashboard/patients/${patient._id}/delete`);
   ```

---

#### `src/pages/patients/PatientDetail.tsx`

**File Purpose:**

- Display detailed patient information
- View complete patient profile

**States:**

```typescript
const [patient, setPatient] = useState<Patient | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
```

**Main Function:**

##### `fetchPatient()`

```typescript
const fetchPatient = async () => {
  try {
    setLoading(true);
    setError("");
    const patientData = await PatientService.getById(id!);
    setPatient(patientData);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch patient");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (id) {
    fetchPatient();
  }
}, [id]);
```

**Features:**

- Display patient full name
- Show date of birth
- Display contact information
- Show insurance details
- Action buttons (Back, Edit, Delete)

**Purpose:** View all patient details before editing or deleting

---

#### `src/pages/patients/PatientEdit.tsx`

**File Purpose:**

- Edit existing patient information
- Update patient details

**States:**

```typescript
const [loading, setLoading] = useState(false);
const [fetchLoading, setFetchLoading] = useState(true);
const [error, setError] = useState("");
const [formData, setFormData] = useState<PatientFormData>({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  contact: "",
  insurance: "",
});
```

**Main Functions:**

##### `fetchPatient()`

```typescript
const fetchPatient = async () => {
  try {
    setFetchLoading(true);
    setError("");
    const patient = await PatientService.getById(id!);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth.split("T")[0],  // Format date
      contact: patient.contact,
      insurance: patient.insurance,
    });
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch patient");
  } finally {
    setFetchLoading(false);
  }
};
```

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");
    await PatientService.update(id!, formData);
    navigate(`/dashboard/patients/${id}`);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to update patient");
  } finally {
    setLoading(false);
  }
};
```

**Features:**

- Pre-filled form with existing data
- Loading state while fetching
- Validation before submission
- Redirect to detail page after update

**Purpose:**

1. Load existing patient data
2. Allow user to modify fields
3. Validate and submit changes
4. Show updated patient details

---

#### `src/pages/patients/PatientDelete.tsx`

**File Purpose:**

- Confirm patient deletion
- Safety check before permanent deletion

**States:**

```typescript
const [patient, setPatient] = useState<Patient | null>(null);
const [loading, setLoading] = useState(false);
const [fetchLoading, setFetchLoading] = useState(true);
const [error, setError] = useState("");
```

**Main Functions:**

##### `fetchPatient()`

```typescript
const fetchPatient = async () => {
  try {
    setFetchLoading(true);
    setError("");
    const patientData = await PatientService.getById(id!);
    setPatient(patientData);
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to fetch patient");
  } finally {
    setFetchLoading(false);
  }
};
```

##### `handleDelete()`

```typescript
const handleDelete = async () => {
  if (!patient) return;

  try {
    setLoading(true);
    setError("");
    await PatientService.delete(id!);
    navigate("/dashboard/patients");
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to delete patient");
  } finally {
    setLoading(false);
  }
};
```

**Features:**

- Display patient information before deletion
- Confirmation prompt
- Warning message about permanent deletion
- Cancel button to go back
- Delete button with loading state

**Purpose:**

1. Show patient details one last time
2. Confirm user intention
3. Delete patient from database
4. Return to patient list

**Safety Warnings:**

- "Are you sure you want to delete this patient?"
- "This action cannot be undone"
- "All associated records will be affected"

---

#### `src/pages/patients/PatientCreate.tsx`

**File Purpose:**

- Form to add a new patient

**States:**

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [formData, setFormData] = useState<PatientFormData>({
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  contact: "",
  insurance: "",
});
```

**Main Functions:**

##### `handleChange()`

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};
```

**Purpose:** Update form field value

##### `handleSubmit()`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");

    // Create new patient
    await PatientService.create(formData);

    // Return to patient list
    navigate("/dashboard/patients");
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to create patient");
  } finally {
    setLoading(false);
  }
};
```

**Purpose:**

1. Validate data
2. Send to server
3. Return to patient list

---

### 📌 Appointment Pages

#### `src/pages/appointments/AppointmentsList.tsx`

**File Purpose:**

- Display list of appointments
- Manage appointments based on user role

**Special Features:**

1. **Display different content based on role:**

   ```typescript
   if (user?.role === "patient" && user?.id) {
     // Patient sees only their appointments
     const appointmentsData = await AppointmentService.getByPatient(user.id);
   } else {
     // Others see all appointments
     const appointmentsData = await AppointmentService.getAll();
   }
   ```

2. **Display patient and doctor data:**

   ```typescript
   const getPatientName = (appointment: Appointment) => {
     if (typeof appointment.patientId === "object") {
       return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
     }
     return "Unknown Patient";
   };
   ```

3. **Control operations based on role:**

   ```typescript
   const canEdit = (appointment: Appointment) => {
     return ["admin", "doctor", "infirmier", "secretary"].includes(
       user?.role || ""
     );
   };

   const canDelete = (appointment: Appointment) => {
     return ["admin", "secretary"].includes(user?.role || "");
   };
   ```

**Available Operations:**

- View details
- Edit (for authorized roles)
- Complete (for doctors and admins)
- Delete (for admins and secretaries)

---

### 📌 Consultation Pages

#### `src/pages/consultations/ConsultationsList.tsx`

**File Purpose:**

- Display medical consultations
- Manage consultation lifecycle

**Features:**

1. **Retrieve data based on role:**

   ```typescript
   if (user?.role === "patient" && user?.id) {
     // Patient consultations
     const consultationsData = await ConsultationService.getByPatient(user.id);
   } else if (user?.role === "doctor" && user?.id) {
     // Doctor consultations
     const consultationsData = await ConsultationService.getByDoctor(user.id);
   } else {
     // All consultations (Admin)
     const consultationsData = await ConsultationService.getAll();
   }
   ```

2. **Display consultation status:**

   ```typescript
   const getStatusBadge = (status: string) => {
     const statusColors = {
       pending: "bg-yellow-100 text-yellow-800",
       completed: "bg-green-100 text-green-800",
     };
     return statusColors[status as keyof typeof statusColors];
   };
   ```

3. **Control operations:**

   ```typescript
   const canEdit = (consultation: Consultation) => {
     return (
       ["admin", "doctor"].includes(user?.role || "") &&
       consultation.status === "pending"
     );
   };

   const canComplete = (consultation: Consultation) => {
     return (
       ["admin", "doctor"].includes(user?.role || "") &&
       consultation.status === "pending"
     );
   };
   ```

---

## 🎯 Main Workflows

### 1. Login

```
User enters email and password
    ↓
LoginPage sends data via api.post("/api/auth/login", ...)
    ↓
Server verifies data
    ↓
If correct: returns accessToken, refreshToken, and userData
    ↓
authStore.login() saves data to Session Storage
    ↓
User is redirected to dashboard
```

### 2. Protected Requests

```
Page requests data from API
    ↓
request interceptor adds Authorization header
    ↓
Server verifies token
    ↓
If valid: returns data
    ↓
If expired (401): response interceptor attempts refresh
    ↓
Request new token with refreshToken
    ↓
If successful: retry original request with new token
    ↓
If failed: redirect to login page
```

### 3. Add New Patient

```
User opens PatientCreate page
    ↓
Fills form with patient data
    ↓
Clicks "Create Patient" button
    ↓
handleSubmit calls PatientService.create()
    ↓
Service makes POST request to server
    ↓
Server saves new patient
    ↓
Code redirects user to patient list
```

---

## 📝 Important Notes

1. **Session Storage vs LocalStorage**:
   - Application uses Session Storage (cleared on browser close)
   - But RegisterPage uses localStorage (needs to be fixed)

2. **Error Handling**:
   - Each service function throws error to the page
   - Page displays error message to user

3. **Route Protection**:
   - ProtectedRoute: requires accessToken
   - GuestRoute: refuses logged-in users
   - RoleBasedRoute: requires specific role

4. **Functions That Need Development**:
   - PatientDetail, PatientEdit, PatientDelete
   - AppointmentCreate, AppointmentEdit, AppointmentComplete, AppointmentCancel
   - ConsultationCreate, ConsultationEdit, ConsultationComplete
   - MedicalRecord pages
   - User pages
   - Sidebar needs different options based on Patient and Secretary roles

---

## 🚀 Summary

CareFlow Frontend is a complete React application for clinic management that offers:

- ✅ Secure authentication system with refreshable tokens
- ✅ Centralized state management with Zustand
- ✅ Route protection based on user role
- ✅ Specialized services for each entity (Patient, Appointment, etc.)
- ✅ Beautiful user interface with Tailwind CSS
- ✅ Complete error handling

---

**Last Updated:** November 20, 2025
