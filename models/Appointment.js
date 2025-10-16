import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    heure: {
      type: String,
      required: true,
    },
    statut: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, date: 1, heure: 1 });
appointmentSchema.index({ patientId: 1, date: 1, heure: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);

export { Appointment };
