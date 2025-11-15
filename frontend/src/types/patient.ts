export interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  contact: string;
  insurance: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  contact: string;
  insurance: string;
}

export interface PatientCreateRequest extends PatientFormData { }

export interface PatientUpdateRequest extends PatientFormData { }
