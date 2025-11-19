import api from "@/api/axiosConfig";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: string;
}

export class UserService {
  private static basePath = "/api/auth/users";
  private static doctorsPath = "/api/auth/doctors";

  static async getAll(): Promise<User[]> {
    try {
      const response = await api.get(this.basePath); return response.data.data || response.data || [];
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        return [];
      }
      throw error;
    }
  }

  static async getAllDoctors(): Promise<User[]> {
    try {
      const response = await api.get(this.doctorsPath);
      return response.data.data || response.data || [];
    } catch (error) {
      return [];
    }
  }
}
