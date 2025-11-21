
export interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface Consultation {
  _id: string;
  appointmentId: {
    _id: string;
    date: string;
    heure: string;
  } | string;
  patientId: {
    _id: string;
    firstName: string;
    lastName: string;
    contact: string;
  } | string;
  medicalRecordId?: {
    _id: string;
  } | string;
  vitalSigns?: VitalSigns;
  diagnosis?: string;
  procedures?: string[]; notes?: string;
  status: "draft" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsultationFormData {
  appointmentId: string;
  patientId: string;
  medicalRecordId?: string;
  vitalSigns?: VitalSigns;
  diagnosis?: string; procedures?: string[];
  notes?: string;
  status?: "draft" | "completed";
}

export interface ConsultationCreateRequest extends ConsultationFormData { }

export interface ConsultationUpdateRequest extends Partial<ConsultationFormData> { }
