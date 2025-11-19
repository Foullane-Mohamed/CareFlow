import api from "@/api/axiosConfig";
import type {
  Appointment,
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
} from "@/types/appointment";

export class AppointmentService {
  private static basePath = "/api/appointments";

  static async getAll(): Promise<Appointment[]> {
    try {
      const response = await api.get(this.basePath);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getDoctorsFromAppointments(): Promise<Array<{ _id: string; name: string; email: string }>> {
    try {
      const appointments = await this.getAll();
      const doctorsMap = new Map<string, { _id: string; name: string; email: string }>();

      appointments.forEach((appointment) => {
        if (appointment.doctorId && typeof appointment.doctorId === "object") {
          const doctor = appointment.doctorId;
          if (doctor._id) {
            doctorsMap.set(doctor._id, {
              _id: doctor._id,
              name: doctor.name || "Unknown Doctor",
              email: doctor.email || "",
            });
          }
        }
      });
      return Array.from(doctorsMap.values());
    } catch (error) {
      return [];
    }
  }

  static async getById(id: string): Promise<Appointment> {
    try {
      const response = await api.get(`${this.basePath}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getByPatient(patientId: string): Promise<Appointment[]> {
    try {
      const response = await api.get(`${this.basePath}?patientId=${patientId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      throw error;
    }
  }

  static async create(appointmentData: AppointmentCreateRequest): Promise<Appointment> {
    try {
      const response = await api.post(this.basePath, appointmentData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async update(
    id: string,
    appointmentData: AppointmentUpdateRequest
  ): Promise<Appointment> {
    try {
      const response = await api.put(`${this.basePath}/${id}`, appointmentData);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async cancel(id: string): Promise<Appointment> {
    try {
      const response = await api.patch(`${this.basePath}/${id}/cancel`);
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  }

  static async complete(id: string): Promise<Appointment> {
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
