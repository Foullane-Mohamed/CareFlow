import express from "express";
import {
  createPatientController,
  getPatientsController,
  getPatientByIdController,
  updatePatientController,
  deletePatientController,
} from "../controllers/patientController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  checkPermission("CREATE_PATIENT"),
  createPatientController
);
router.get(
  "/",
  authenticate,
  checkPermission("VIEW_PATIENTS"),
  getPatientsController
);
router.get(
  "/:id",
  authenticate,
  checkPermission("VIEW_PATIENTS"),
  getPatientByIdController
);
router.put(
  "/:id",
  authenticate,
  checkPermission("UPDATE_PATIENT"),
  updatePatientController
);
router.delete(
  "/:id",
  authenticate,
  checkPermission("MANAGE_PATIENTS"),
  deletePatientController
);

export default router;
