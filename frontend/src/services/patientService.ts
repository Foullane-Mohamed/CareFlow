import api from "@/api/axiosConfig";
import type { Patient, PatientCreateRequest, PatientUpdateRequest } from "@/types/patient";

export class PatientService {
  private static basePath = "/api/patients";

  static async getAll(): Promise<Patient[]> {
    try {
      const response = await api.get(this.basePath);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Patient> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to fetch patient ${id}:`, error);
      throw error;
    }
  }

  static async create(patientData: PatientCreateRequest): Promise<Patient> {
    try {
      const response = await api.post(this.basePath, patientData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Failed to create patient:", error);
      throw error;
    }
  }

  static async update(id: string, patientData: PatientUpdateRequest): Promise<Patient> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, patientData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to update patient ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.basePath}/${id}`);
    } catch (error) {
      console.error(`Failed to delete patient ${id}:`, error);
      throw error;
    }
  }
}
