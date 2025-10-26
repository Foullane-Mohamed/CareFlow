import {
  createConsultation,
  getConsultationById,
  getAllConsultations,
  getConsultationsByPatient,
  getConsultationsByDoctor,
  updateConsultation,
  markAsCompleted,
  deleteConsultation,
} from "../services/consultationService.js";
import {
  createConsultationValidation,
  updateConsultationValidation,
} from "../validators/consultationValidator.js";

const createConsultationController = async (req, res, next) => {
  try {
    const { error } = createConsultationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const consultation = await createConsultation(req.body, req.user._id);

    res.status(201).json(consultation);
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("already exists")) {
      return res.status(409).json({ message: err.message });
    }
    if (err.message.includes("Only doctors")) {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

const getConsultationByIdController = async (req, res, next) => {
  try {
    const consultation = await getConsultationById(req.params.id);
    res.status(200).json(consultation);
  } catch (err) {
    if (err.message === "Consultation not found") {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
};

const getAllConsultationsController = async (req, res, next) => {
  try {
    const filters = {
      patientId: req.query.patientId,
      doctorId: req.query.doctorId,
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const consultations = await getAllConsultations(filters);
    res.status(200).json(consultations);
  } catch (err) {
    next(err);
  }
};

const getConsultationsByPatientController = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const consultations = await getConsultationsByPatient(
      req.params.patientId,
      filters
    );
    res.status(200).json(consultations);
  } catch (err) {
    next(err);
  }
};

const getConsultationsByDoctorController = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const consultations = await getConsultationsByDoctor(
      req.params.doctorId,
      filters
    );
    res.status(200).json(consultations);
  } catch (err) {
    next(err);
  }
};

const updateConsultationController = async (req, res, next) => {
  try {
    const { error } = updateConsultationValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const consultation = await updateConsultation(
      req.params.id,
      req.body,
      req.user._id,
      req.user.role
    );

    res.status(200).json(consultation);
  } catch (err) {
    if (err.message === "Consultation not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("Forbidden")) {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

const completeConsultationController = async (req, res, next) => {
  try {
    const consultation = await markAsCompleted(
      req.params.id,
      req.user._id,
      req.user.role
    );

    res.status(200).json(consultation);
  } catch (err) {
    if (err.message === "Consultation not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("Forbidden")) {
      return res.status(403).json({ message: err.message });
    }
    if (err.message.includes("already completed")) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

const deleteConsultationController = async (req, res, next) => {
  try {
    const result = await deleteConsultation(
      req.params.id,
      req.user._id,
      req.user.role
    );

    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Consultation not found") {
      return res.status(404).json({ message: err.message });
    }
    if (err.message.includes("Forbidden")) {
      return res.status(403).json({ message: err.message });
    }
    next(err);
  }
};

export {
  createConsultationController,
  getConsultationByIdController,
  getAllConsultationsController,
  getConsultationsByPatientController,
  getConsultationsByDoctorController,
  updateConsultationController,
  completeConsultationController,
  deleteConsultationController,
};
