import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import MainLayout from "@/layouts/MainLayout";
import DashboardHome from "../pages/dashboard/DashboardHome";
import PatientsList from "@/pages/patients/PatientsList";
import PatientCreate from "@/pages/patients/PatientCreate";
import PatientDetail from "@/pages/patients/PatientDetail";
import PatientEdit from "@/pages/patients/PatientEdit";
import PatientDelete from "@/pages/patients/PatientDelete";
import AppointmentsList from "@/pages/appointments/AppointmentsList";
import AppointmentCreate from "@/pages/appointments/AppointmentCreate";
import AppointmentDetail from "@/pages/appointments/AppointmentDetail";
import AppointmentEdit from "@/pages/appointments/AppointmentEdit";
import AppointmentCancel from "@/pages/appointments/AppointmentCancel";
import AppointmentComplete from "@/pages/appointments/AppointmentComplete";
import AppointmentDelete from "@/pages/appointments/AppointmentDelete";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />{" "}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="patients" element={<PatientsList />} />
          <Route path="patients/create" element={<PatientCreate />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="patients/:id/edit" element={<PatientEdit />} />
          <Route path="patients/:id/delete" element={<PatientDelete />} />
          <Route path="appointments" element={<AppointmentsList />} />
          <Route path="appointments/create" element={<AppointmentCreate />} />
          <Route path="appointments/:id" element={<AppointmentDetail />} />
          <Route
            path="appointments/:id/edit"
            element={<AppointmentEdit />}
          />{" "}
          <Route
            path="appointments/:id/cancel"
            element={<AppointmentCancel />}
          />
          <Route
            path="appointments/:id/complete"
            element={<AppointmentComplete />}
          />{" "}
          <Route
            path="appointments/:id/delete"
            element={<AppointmentDelete />}
          />
          <Route path="my-appointments" element={<AppointmentsList />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
