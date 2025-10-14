import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    contact: { type: String, required: true },
    insurance: { type: String },
    allergies: { type: [String], default: [] },
    medicalHistory: { type: [String], default: [] },
    consent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Patient = mongoose.model("Patient", patientSchema);
