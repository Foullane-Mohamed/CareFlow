import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Appointment } from "@/types/appointment";
import { AppointmentService } from "@/services/appointmentService";
import { useAuthStore } from "@/store/authStore";

export default function AppointmentDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchAppointment = async () => {
    try {
      setLoading(true);
      setError("");
      const appointmentData = await AppointmentService.getById(id!);
      setAppointment(appointmentData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch appointment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };
  const getPatientName = () => {
    if (
      appointment &&
      typeof appointment.patientId === "object" &&
      appointment.patientId !== null
    ) {
      return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }
    if (appointment && typeof appointment.patientId === "string") {
      return `Patient ID: ${appointment.patientId.slice(0, 8)}...`;
    }
    return "Unknown Patient";
  };

  const getPatientContact = () => {
    if (
      appointment &&
      typeof appointment.patientId === "object" &&
      appointment.patientId !== null
    ) {
      return appointment.patientId.contact;
    }
    return "N/A";
  };

  const getDoctorName = () => {
    if (
      appointment &&
      typeof appointment.doctorId === "object" &&
      appointment.doctorId !== null
    ) {
      return appointment.doctorId.name;
    }
    if (appointment && typeof appointment.doctorId === "string") {
      return `Doctor ID: ${appointment.doctorId.slice(0, 8)}...`;
    }
    return "Unknown Doctor";
  };

  const getDoctorEmail = () => {
    if (
      appointment &&
      typeof appointment.doctorId === "object" &&
      appointment.doctorId !== null
    ) {
      return appointment.doctorId.email;
    }
    return "N/A";
  };

  const canEdit = () => {
    return (
      ["admin", "doctor", "infirmier", "secretary"].includes(
        user?.role || ""
      ) && appointment?.status === "scheduled"
    );
  };

  const canComplete = () => {
    return (
      ["admin", "doctor"].includes(user?.role || "") &&
      appointment?.status === "scheduled"
    );
  };

  const canDelete = () => {
    return ["admin", "secretary"].includes(user?.role || "");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Details
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Appointment Details
          </h1>
          <button
            onClick={() => navigate("/dashboard/appointments")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Appointments
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {error || "Appointment not found"}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Appointment Details
        </h1>
        <button
          onClick={() => navigate("/dashboard/appointments")}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Back to Appointments
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Appointment Information
          </h2>
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadge(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Patient Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{getPatientName()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Patient Contact
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {getPatientContact()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Doctor Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{getDoctorName()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Doctor Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{getDoctorEmail()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Time</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {appointment.heure}
              </dd>
            </div>
            {appointment.createdAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Created At
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(appointment.createdAt).toLocaleString()}
                </dd>
              </div>
            )}{" "}
            {appointment.updatedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(appointment.updatedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {canEdit() && (
            <button
              onClick={() =>
                navigate(`/dashboard/appointments/${appointment._id}/edit`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit Appointment
            </button>
          )}

          {canComplete() && (
            <button
              onClick={() =>
                navigate(`/dashboard/appointments/${appointment._id}/complete`)
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Mark as Completed
            </button>
          )}

          {appointment?.status === "scheduled" &&
            ["admin", "secretary", "patient"].includes(user?.role || "") && (
              <button
                onClick={() =>
                  navigate(`/dashboard/appointments/${appointment._id}/cancel`)
                }
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Cancel Appointment
              </button>
            )}

          {canDelete() && (
            <button
              onClick={() =>
                navigate(`/dashboard/appointments/${appointment._id}/delete`)
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Delete Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
