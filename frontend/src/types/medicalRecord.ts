
export interface PatientInfo {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  contact: string;
  insurance?: string;
}

export interface LabResult {
  title: string;
  result: string;
  date: string;
}

export interface MedicalRecord {
  _id: string;
  patientId: {
    _id: string;
    firstName: string;
    lastName: string;
    contact: string;
  } | string;
  patientInfo: PatientInfo;
  allergies?: string[];
  medicalHistory?: string[];
  currentMedications?: string[];
  labResults?: LabResult[];
  notes?: string;
  consent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalRecordFormData {
  patientId: string;
  patientInfo: PatientInfo;
  allergies?: string[];
  medicalHistory?: string[];
  currentMedications?: string[];
  labResults?: LabResult[];
  notes?: string;
  consent: boolean;
}

export interface MedicalRecordCreateRequest extends MedicalRecordFormData { }

export interface MedicalRecordUpdateRequest extends Partial<MedicalRecordFormData> { }
