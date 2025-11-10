import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    medicalRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord",
      default: null,
    },
    vitalSigns: {
      bloodPressure: { type: String, default: null },
      heartRate: { type: Number, min: 40, max: 200, default: null },
      temperature: { type: Number, min: 35, max: 42, default: null },
      weight: { type: Number, min: 0, default: null },
      height: { type: Number, min: 0, default: null },
      respiratoryRate: { type: Number, min: 0, max: 60, default: null },
      oxygenSaturation: { type: Number, min: 0, max: 100, default: null },
    },
    diagnosis: {
      type: String,
      maxlength: 2000,
      default: "",
    },
    procedures: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Consultation = mongoose.model("Consultation", consultationSchema);

export { Consultation };
