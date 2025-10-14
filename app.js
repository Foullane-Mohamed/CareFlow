import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("EHR API running"));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

app.use(errorMiddleware);

export default app;
