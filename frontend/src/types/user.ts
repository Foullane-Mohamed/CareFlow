export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "infirmier" | "secretary" | "patient";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "doctor" | "infirmier" | "secretary" | "patient";
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  role?: "admin" | "doctor" | "infirmier" | "secretary" | "patient";
}

export interface UserCreateRequest extends UserFormData { }

export interface UserUpdateRequest extends UserUpdateData { }
