import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../services/patientService.js";
import { patientValidation } from "../validators/patientValidator.js";

export const createPatientController = async (req, res, next) => {
  try {
    const { error } = patientValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};

export const getPatientsController = async (req, res, next) => {
  try {
    const patients = await getPatients(req.query);
    res.status(200).json(patients);
  } catch (err) {
    next(err);
  }
};

export const getPatientByIdController = async (req, res, next) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};

export const updatePatientController = async (req, res, next) => {
  try {
    const { error } = patientValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const patient = await updatePatient(req.params.id, req.body);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};

export const deletePatientController = async (req, res, next) => {
  try {
    const patient = await deletePatient(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    next(err);
  }
};
