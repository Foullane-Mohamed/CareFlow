import { Appointment } from "../models/Appointment.js";

const checkAvailability = async (
  doctorId,
  patientId,
  date,
  heure,
  excludeAppointmentId = null
) => {
  const dateObj = new Date(date);
  dateObj.setHours(0, 0, 0, 0);

  const nextDay = new Date(dateObj);
  nextDay.setDate(nextDay.getDate() + 1);

  const query = {
    date: { $gte: dateObj, $lt: nextDay },
    heure: heure,
    statut: { $ne: "cancelled" },
    $or: [{ doctorId: doctorId }, { patientId: patientId }],
  };

  if (excludeAppointmentId) {
    query._id = { $ne: excludeAppointmentId };
  }

  const conflict = await Appointment.findOne(query);
  return !conflict;
};

const createAppointment = async (data) => {
  const { doctorId, patientId, date, heure } = data;

  const isAvailable = await checkAvailability(doctorId, patientId, date, heure);

  if (!isAvailable) {
    throw {
      statusCode: 409,
      message: "Doctor or patient not available at this time",
    };
  }

  const appointment = new Appointment(data);
  return await appointment.save();
};

const getAppointments = async (filters = {}) => {
  const query = {};

  if (filters.doctorId) {
    query.doctorId = filters.doctorId;
  }

  if (filters.patientId) {
    query.patientId = filters.patientId;
  }

  if (filters.date) {
    const dateObj = new Date(filters.date);
    dateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    query.date = { $gte: dateObj, $lt: nextDay };
  }

  if (filters.statut) {
    query.statut = filters.statut;
  }

  return await Appointment.find(query)
    .populate("patientId", "firstName lastName contact")
    .populate("doctorId", "name email")
    .sort({ date: 1, heure: 1 });
};

const getAppointmentById = async (id) => {
  return await Appointment.findById(id)
    .populate("patientId", "firstName lastName contact dateOfBirth")
    .populate("doctorId", "name email role");
};

const updateAppointment = async (id, data) => {
  const existingAppointment = await Appointment.findById(id);

  if (!existingAppointment) {
    return null;
  }

  const needsAvailabilityCheck =
    data.date || data.heure || data.doctorId || data.patientId;

  if (needsAvailabilityCheck) {
    const doctorId = data.doctorId || existingAppointment.doctorId;
    const patientId = data.patientId || existingAppointment.patientId;
    const date = data.date || existingAppointment.date;
    const heure = data.heure || existingAppointment.heure;

    const isAvailable = await checkAvailability(
      doctorId,
      patientId,
      date,
      heure,
      id
    );

    if (!isAvailable) {
      throw {
        statusCode: 409,
        message: "Doctor or patient not available at this time",
      };
    }
  }

  return await Appointment.findByIdAndUpdate(id, data, { new: true })
    .populate("patientId", "firstName lastName contact")
    .populate("doctorId", "name email");
};

const deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

const completeAppointment = async (id) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return null;
  }

  if (appointment.statut === "cancelled") {
    throw {
      statusCode: 400,
      message: "Cannot complete a cancelled appointment",
    };
  }

  appointment.statut = "completed";
  return await appointment.save();
};

const cancelAppointment = async (id) => {
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return null;
  }

  if (appointment.statut === "completed") {
    throw {
      statusCode: 400,
      message: "Cannot cancel a completed appointment",
    };
  }

  appointment.statut = "cancelled";
  return await appointment.save();
};

export {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  completeAppointment,
  cancelAppointment,
};
