import { MedicalRecord } from "../models/MedicalRecord.js";

const createMedicalRecord = async (patientId, doctorId, data) => {
  const medicalRecord = new MedicalRecord({
    patientId,
    doctorId,
    ...data,
  });
  return await medicalRecord.save();
};

const getMedicalRecordByPatientId = async (patientId) => {
  return await MedicalRecord.find({ patientId })
    .populate("patientId", "firstName lastName dateOfBirth contact insurance")
    .populate("doctorId", "name email role");
};

const getMedicalRecordById = async (recordId) => {
  return await MedicalRecord.findById(recordId)
    .populate("patientId", "firstName lastName dateOfBirth contact insurance")
    .populate("doctorId", "name email role");
};

const updateMedicalRecord = async (recordId, data) => {
  return await MedicalRecord.findByIdAndUpdate(recordId, data, { new: true })
    .populate("patientId", "firstName lastName dateOfBirth contact insurance")
    .populate("doctorId", "name email role");
};

const deleteMedicalRecord = async (recordId) => {
  return await MedicalRecord.findByIdAndDelete(recordId);
};

const getAllMedicalRecords = async () => {
  return await MedicalRecord.find()
    .populate("patientId", "firstName lastName dateOfBirth contact insurance")
    .populate("doctorId", "name email role");
};

export {
  createMedicalRecord,
  getMedicalRecordByPatientId,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
};
