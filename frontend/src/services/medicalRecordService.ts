import api from "@/api/axiosConfig";
import type {
  MedicalRecord,
  MedicalRecordCreateRequest,
  MedicalRecordUpdateRequest,
} from "@/types/medicalRecord";

export class MedicalRecordService {
  private static basePath = "/api/v1/medical-records";

  static async getAll(): Promise<MedicalRecord[]> {
    try {
      const response = await api.get(this.basePath);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id: string): Promise<MedicalRecord> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getByPatient(patientId: string): Promise<MedicalRecord[]> {
    try {
      const response = await api.get(`${this.basePath}/patient/${patientId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async create(medicalRecordData: MedicalRecordCreateRequest): Promise<MedicalRecord> {
    try {
      const response = await api.post(this.basePath, medicalRecordData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async update(
    id: string,
    medicalRecordData: MedicalRecordUpdateRequest
  ): Promise<MedicalRecord> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, medicalRecordData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await api.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw error;
    }
  }
}
