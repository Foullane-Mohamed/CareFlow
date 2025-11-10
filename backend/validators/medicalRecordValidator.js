import Joi from "joi";

const medicalRecordValidation = Joi.object({
  patientId: Joi.string().required(),
  patientInfo: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(0).max(150).required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    contact: Joi.string().required(),
    insurance: Joi.string().optional(),
  }).required(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medicalHistory: Joi.array().items(Joi.string()).optional(),
  currentMedications: Joi.array().items(Joi.string()).optional(),
  labResults: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        result: Joi.string().required(),
        date: Joi.date().required(),
      })
    )
    .optional(),
  notes: Joi.string().optional(),
  consent: Joi.boolean().optional(),
});

const medicalRecordUpdateValidation = Joi.object({
  patientInfo: Joi.object({
    name: Joi.string().optional(),
    age: Joi.number().min(0).max(150).optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    contact: Joi.string().optional(),
    insurance: Joi.string().optional(),
  }).optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medicalHistory: Joi.array().items(Joi.string()).optional(),
  currentMedications: Joi.array().items(Joi.string()).optional(),
  labResults: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        result: Joi.string().required(),
        date: Joi.date().required(),
      })
    )
    .optional(),
  notes: Joi.string().optional(),
  consent: Joi.boolean().optional(),
});

export { medicalRecordValidation, medicalRecordUpdateValidation };
