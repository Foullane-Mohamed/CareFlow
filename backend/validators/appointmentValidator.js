import Joi from "joi";

const appointmentValidation = Joi.object({
  patientId: Joi.string().required(),
  doctorId: Joi.string().required(),
  date: Joi.date().required(),
  heure: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:MM format (e.g., 09:30)",
    }),
  statut: Joi.string().valid("scheduled", "completed", "cancelled").optional(),
});

const updateAppointmentValidation = Joi.object({
  patientId: Joi.string().optional(),
  doctorId: Joi.string().optional(),
  date: Joi.date().optional(),
  heure: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base": "Time must be in HH:MM format (e.g., 09:30)",
    }),
  statut: Joi.string().valid("scheduled", "completed", "cancelled").optional(),
});

export { appointmentValidation, updateAppointmentValidation };
