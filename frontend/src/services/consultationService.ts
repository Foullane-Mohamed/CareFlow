import api from "@/api/axiosConfig";
import type {
  Consultation,
  ConsultationCreateRequest,
  ConsultationUpdateRequest,
} from "@/types/consultation";

export class ConsultationService {
  private static basePath = "/api/v1/consultations";

  static async getAll(): Promise<Consultation[]> {
    try {
      const response = await api.get(this.basePath);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id: string): Promise<Consultation> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getByDoctor(doctorId: string): Promise<Consultation[]> {
    try {
      const response = await api.get(`${this.basePath}/doctor/${doctorId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getByPatient(patientId: string): Promise<Consultation[]> {
    try {
      const response = await api.get(`${this.basePath}/patient/${patientId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async create(consultationData: ConsultationCreateRequest): Promise<Consultation> {
    try {
      const response = await api.post(this.basePath, consultationData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async update(
    id: string,
    consultationData: ConsultationUpdateRequest
  ): Promise<Consultation> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, consultationData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async complete(id: string): Promise<Consultation> {
    try {
      const response = await api.patch(`${this.basePath}/${id}/complete`);
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
