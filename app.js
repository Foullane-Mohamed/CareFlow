import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import consultationRoutes from "./routes/consultationRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("EHR API running"));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/v1/medical-records", medicalRecordRoutes);
app.use("/api/v1/consultations", consultationRoutes);

app.use(errorMiddleware);

export default app;
