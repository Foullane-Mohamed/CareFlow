import { Patient } from "../models/Patient.js";

export const createPatient = async (data) => {
  const patient = new Patient(data);
  return await patient.save();
};

export const getPatients = async (filters = {}) => {
  const query = {};

  if (filters.firstName) {
    query.firstName = { $regex: filters.firstName, $options: "i" };
  }

  if (filters.lastName) {
    query.lastName = { $regex: filters.lastName, $options: "i" };
  }

  if (filters.dateOfBirth) {
    query.dateOfBirth = new Date(filters.dateOfBirth);
  }

  if (filters.insurance) {
    query.insurance = { $regex: filters.insurance, $options: "i" };
  }

  if (filters.contact) {
    query.contact = { $regex: filters.contact, $options: "i" };
  }

  return await Patient.find(query);
};

export const getPatientById = async (id) => {
  return await Patient.findById(id);
};

export const updatePatient = async (id, data) => {
  return await Patient.findByIdAndUpdate(id, data, { new: true });
};

export const deletePatient = async (id) => {
  return await Patient.findByIdAndDelete(id);
};
