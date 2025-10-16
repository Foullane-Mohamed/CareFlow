import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  completeAppointment,
  cancelAppointment,
} from "../services/appointmentService.js";
import {
  appointmentValidation,
  updateAppointmentValidation,
} from "../validators/appointmentValidator.js";

const createAppointmentController = async (req, res, next) => {
  try {
    const { error } = appointmentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

const getAppointmentsController = async (req, res, next) => {
  try {
    const appointments = await getAppointments(req.query);
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

const getAppointmentByIdController = async (req, res, next) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

const updateAppointmentController = async (req, res, next) => {
  try {
    const { error } = updateAppointmentValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const appointment = await updateAppointment(req.params.id, req.body);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

const deleteAppointmentController = async (req, res, next) => {
  try {
    const appointment = await deleteAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const completeAppointmentController = async (req, res, next) => {
  try {
    const appointment = await completeAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

const cancelAppointmentController = async (req, res, next) => {
  try {
    const appointment = await cancelAppointment(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

export {
  createAppointmentController,
  getAppointmentsController,
  getAppointmentByIdController,
  updateAppointmentController,
  deleteAppointmentController,
  completeAppointmentController,
  cancelAppointmentController,
};
