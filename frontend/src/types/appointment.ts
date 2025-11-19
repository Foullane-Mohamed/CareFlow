export interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    firstName: string;
    lastName: string;
    contact: string;
  } | string;
  doctorId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  date: string;
  heure: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt?: string;
  updatedAt?: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  date: string;
  heure: string;
}

export interface AppointmentCreateRequest extends AppointmentFormData { }

export interface AppointmentUpdateRequest extends AppointmentFormData { }
