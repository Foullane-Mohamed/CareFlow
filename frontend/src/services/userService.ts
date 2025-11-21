import api from "@/api/axiosConfig";
import type {
  User,
} from "@/types/user";

export class UserService {
  private static basePath = "/api/auth/users";
  private static doctorsPath = "/api/auth/doctors";

  static async getAll(): Promise<User[]> {
    try {
      const response = await api.get(this.basePath);
      return response.data.data || response.data || [];
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        return [];
      }
      throw error;
    }
  }

  static async getById(id: string): Promise<User> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getByRole(role: string): Promise<User[]> {
    try {
      const response = await api.get(`${this.basePath}/role/${role}`);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }






  static async toggleStatus(id: string): Promise<User> {
    try {
      const response = await api.patch(`${this.basePath}/${id}/toggle-status`);
      return response.data.data || response.data;
    } catch (error) {
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
