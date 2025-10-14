import Joi from "joi";

export const patientValidation = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  contact: Joi.string().required(),
  insurance: Joi.string().optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  medicalHistory: Joi.array().items(Joi.string()).optional(),
  consent: Joi.boolean().optional(),
});


