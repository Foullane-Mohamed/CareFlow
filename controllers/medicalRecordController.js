import {
  createMedicalRecord,
  getMedicalRecordByPatientId,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllMedicalRecords,
} from "../services/medicalRecordService.js";
import {
  medicalRecordValidation,
  medicalRecordUpdateValidation,
} from "../validators/medicalRecordValidator.js";

const createMedicalRecordController = async (req, res, next) => {
  try {
    const { error } = medicalRecordValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { patientId, ...data } = req.body;
    const doctorId = req.user._id;

    const medicalRecord = await createMedicalRecord(patientId, doctorId, data);
    res.status(201).json(medicalRecord);
  } catch (err) {
    next(err);
  }
};

const getMedicalRecordByPatientIdController = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const medicalRecords = await getMedicalRecordByPatientId(patientId);

    if (!medicalRecords || medicalRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "No medical records found for this patient" });
    }

    res.status(200).json(medicalRecords);
  } catch (err) {
    next(err);
  }
};

const getMedicalRecordByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicalRecord = await getMedicalRecordById(id);

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json(medicalRecord);
  } catch (err) {
    next(err);
  }
};

const updateMedicalRecordController = async (req, res, next) => {
  try {
    const { error } = medicalRecordUpdateValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { id } = req.params;
    const medicalRecord = await updateMedicalRecord(id, req.body);

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json(medicalRecord);
  } catch (err) {
    next(err);
  }
};

const deleteMedicalRecordController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicalRecord = await deleteMedicalRecord(id);

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const getAllMedicalRecordsController = async (req, res, next) => {
  try {
    const medicalRecords = await getAllMedicalRecords();
    res.status(200).json(medicalRecords);
  } catch (err) {
    next(err);
  }
};

export {
  createMedicalRecordController,
  getMedicalRecordByPatientIdController,
  getMedicalRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  getAllMedicalRecordsController,
};
