import mongoose from "mongoose";

const labResultSchema = new mongoose.Schema({
  title: { type: String, required: true },
  result: { type: String, required: true },
  date: { type: Date, required: true },
});

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientInfo: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
      },
      contact: { type: String, required: true },
      insurance: { type: String },
    },
    allergies: { type: [String], default: [] },
    medicalHistory: { type: [String], default: [] },
    currentMedications: { type: [String], default: [] },
    labResults: [labResultSchema],
    notes: { type: String, default: "" },
    consent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

export { MedicalRecord };
