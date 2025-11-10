import express from "express";
import {
  createConsultationController,
  getConsultationByIdController,
  getAllConsultationsController,
  getConsultationsByPatientController,
  getConsultationsByDoctorController,
  updateConsultationController,
  completeConsultationController,
  deleteConsultationController,
} from "../controllers/consultationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  checkPermission("CREATE_CONSULTATION"),
  createConsultationController
);

router.get(
  "/",
  authenticate,
  checkPermission("VIEW_CONSULTATIONS"),
  getAllConsultationsController
);

router.get(
  "/patient/:patientId",
  authenticate,
  checkPermission("VIEW_CONSULTATIONS"),
  getConsultationsByPatientController
);

router.get(
  "/doctor/:doctorId",
  authenticate,
  checkPermission("VIEW_CONSULTATIONS"),
  getConsultationsByDoctorController
);

router.get(
  "/:id",
  authenticate,
  checkPermission("VIEW_CONSULTATIONS"),
  getConsultationByIdController
);

router.put(
  "/:id",
  authenticate,
  checkPermission("UPDATE_CONSULTATION"),
  updateConsultationController
);

router.patch(
  "/:id/complete",
  authenticate,
  checkPermission("COMPLETE_CONSULTATION"),
  completeConsultationController
);

router.delete(
  "/:id",
  authenticate,
  checkPermission("DELETE_CONSULTATION"),
  deleteConsultationController
);

export default router;
