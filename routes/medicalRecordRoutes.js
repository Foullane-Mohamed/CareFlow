import express from "express";
import {
  createMedicalRecordController,
  getMedicalRecordByPatientIdController,
  getMedicalRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  getAllMedicalRecordsController,
} from "../controllers/medicalRecordController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  checkPermission("CREATE_MEDICAL_RECORD"),
  createMedicalRecordController
);

router.get(
  "/",
  authenticate,
  checkPermission("VIEW_ALL_MEDICAL_RECORDS"),
  getAllMedicalRecordsController
);

router.get(
  "/patient/:patientId",
  authenticate,
  checkPermission("VIEW_MEDICAL_RECORD"),
  getMedicalRecordByPatientIdController
);

router.get(
  "/:id",
  authenticate,
  checkPermission("VIEW_MEDICAL_RECORD"),
  getMedicalRecordByIdController
);

router.put(
  "/:id",
  authenticate,
  checkPermission("UPDATE_MEDICAL_RECORD"),
  updateMedicalRecordController
);

router.delete(
  "/:id",
  authenticate,
  checkPermission("DELETE_MEDICAL_RECORD"),
  deleteMedicalRecordController
);

export default router;
