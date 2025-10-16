import express from "express";
import {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  completeAppointmentController,
  cancelAppointmentController,
} from "../controllers/appointmentController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { checkPermission } from "../middlewares/rbacMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  checkPermission("CREATE_APPOINTMENT"),
  createAppointmentController
);

router.get(
  "/",
  authenticate,
  checkPermission("VIEW_APPOINTMENTS"),
  getAppointmentsController
);

router.get(
  "/:id",
  authenticate,
  checkPermission("VIEW_APPOINTMENTS"),
  getAppointmentByIdController
);

router.put(
  "/:id",
  authenticate,
  checkPermission("UPDATE_APPOINTMENT"),
  updateAppointmentController
);

router.delete(
  "/:id",
  authenticate,
  checkPermission("MANAGE_APPOINTMENTS"),
  deleteAppointmentController
);

router.patch(
  "/:id/complete",
  authenticate,
  checkPermission("COMPLETE_APPOINTMENT"),
  completeAppointmentController
);

router.patch(
  "/:id/cancel",
  authenticate,
  checkPermission("CANCEL_APPOINTMENT"),
  cancelAppointmentController
);

export default router;
