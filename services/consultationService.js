import { Consultation } from "../models/Consultation.js";
import { Appointment } from "../models/Appointment.js";
import { Patient } from "../models/Patient.js";
import { User } from "../models/User.js";

const createConsultation = async (data, userId) => {
  const appointment = await Appointment.findById(data.appointmentId);
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const existingConsultation = await Consultation.findOne({
    appointmentId: data.appointmentId,
  });
  if (existingConsultation) {
    throw new Error("Consultation already exists for this appointment");
  }

  const patient = await Patient.findById(data.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const doctorId = data.doctorId || userId;

  const doctor = await User.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }
  if (doctor.role !== "doctor" && doctor.role !== "admin") {
    throw new Error("Only doctors can create consultations");
  }

  const consultation = await Consultation.create({
    ...data,
    doctorId,
  });

  const populatedConsultation = await Consultation.findById(consultation._id)
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId");

  return populatedConsultation;
};

const getConsultationById = async (id) => {
  const consultation = await Consultation.findById(id)
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId");

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  return consultation;
};

const getAllConsultations = async (filters = {}) => {
  const query = {};

  if (filters.patientId) {
    query.patientId = filters.patientId;
  }
  if (filters.doctorId) {
    query.doctorId = filters.doctorId;
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const consultations = await Consultation.find(query)
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId")
    .sort({ createdAt: -1 });

  return consultations;
};

const getConsultationsByPatient = async (patientId, filters = {}) => {
  const query = { patientId };

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const consultations = await Consultation.find(query)
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId")
    .sort({ createdAt: -1 });

  return consultations;
};

const getConsultationsByDoctor = async (doctorId, filters = {}) => {
  const query = { doctorId };

  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const consultations = await Consultation.find(query)
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId")
    .sort({ createdAt: -1 });

  return consultations;
};

const updateConsultation = async (id, data, userId, userRole) => {
  const consultation = await Consultation.findById(id);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  if (
    userRole !== "admin" &&
    consultation.doctorId.toString() !== userId.toString()
  ) {
    throw new Error(
      "Forbidden: Only the doctor who created this consultation or an admin can update it"
    );
  }

  const updatedConsultation = await Consultation.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  )
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId");

  return updatedConsultation;
};

const markAsCompleted = async (id, userId, userRole) => {
  const consultation = await Consultation.findById(id);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  if (
    userRole !== "admin" &&
    consultation.doctorId.toString() !== userId.toString()
  ) {
    throw new Error(
      "Forbidden: Only the doctor who created this consultation or an admin can complete it"
    );
  }

  if (consultation.status === "completed") {
    throw new Error("Consultation is already completed");
  }

  consultation.status = "completed";
  await consultation.save();

  const populatedConsultation = await Consultation.findById(consultation._id)
    .populate("appointmentId", "date heure statut")
    .populate("patientId", "firstName lastName dateOfBirth contact")
    .populate("doctorId", "name email role")
    .populate("medicalRecordId");

  return populatedConsultation;
};

const deleteConsultation = async (id, userId, userRole) => {
  const consultation = await Consultation.findById(id);

  if (!consultation) {
    throw new Error("Consultation not found");
  }

  if (userRole !== "admin") {
    throw new Error("Forbidden: Only administrators can delete consultations");
  }

  await Consultation.findByIdAndDelete(id);

  return { message: "Consultation deleted successfully" };
};

export {
  createConsultation,
  getConsultationById,
  getAllConsultations,
  getConsultationsByPatient,
  getConsultationsByDoctor,
  updateConsultation,
  markAsCompleted,
  deleteConsultation,
};
