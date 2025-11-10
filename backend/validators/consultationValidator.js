import Joi from "joi";

const vitalSignsSchema = Joi.object({
  bloodPressure: Joi.string()
    .pattern(/^\d{2,3}\/\d{2,3}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Blood pressure must be in format XXX/XXX (e.g., 120/80)",
    }),
  heartRate: Joi.number().min(40).max(200).optional().messages({
    "number.min": "Heart rate must be at least 40 bpm",
    "number.max": "Heart rate must not exceed 200 bpm",
  }),
  temperature: Joi.number().min(35).max(42).optional().messages({
    "number.min": "Temperature must be at least 35°C",
    "number.max": "Temperature must not exceed 42°C",
  }),
  weight: Joi.number().positive().optional().messages({
    "number.positive": "Weight must be a positive number",
  }),
  height: Joi.number().positive().optional().messages({
    "number.positive": "Height must be a positive number",
  }),
  respiratoryRate: Joi.number().min(0).max(60).optional().messages({
    "number.min": "Respiratory rate must be at least 0",
    "number.max": "Respiratory rate must not exceed 60",
  }),
  oxygenSaturation: Joi.number().min(0).max(100).optional().messages({
    "number.min": "Oxygen saturation must be at least 0%",
    "number.max": "Oxygen saturation must not exceed 100%",
  }),
});

const createConsultationValidation = Joi.object({
  appointmentId: Joi.string().required().messages({
    "string.empty": "Appointment ID is required",
    "any.required": "Appointment ID is required",
  }),
  patientId: Joi.string().required().messages({
    "string.empty": "Patient ID is required",
    "any.required": "Patient ID is required",
  }),
  doctorId: Joi.string().optional(),
  medicalRecordId: Joi.string().optional().allow(null),
  vitalSigns: vitalSignsSchema.optional(),
  diagnosis: Joi.string().max(2000).optional().messages({
    "string.max": "Diagnosis must not exceed 2000 characters",
  }),
  procedures: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional(),
  status: Joi.string().valid("draft", "completed").optional(),
});

const updateConsultationValidation = Joi.object({
  medicalRecordId: Joi.string().optional().allow(null),
  vitalSigns: vitalSignsSchema.optional(),
  diagnosis: Joi.string().max(2000).optional().messages({
    "string.max": "Diagnosis must not exceed 2000 characters",
  }),
  procedures: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional(),
  status: Joi.string().valid("draft", "completed").optional(),
});

export { createConsultationValidation, updateConsultationValidation };
