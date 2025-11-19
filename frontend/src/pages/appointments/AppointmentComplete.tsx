import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Appointment } from "@/types/appointment";
import { AppointmentService } from "@/services/appointmentService";

export default function AppointmentComplete() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointment = async () => {
    try {
      setFetchLoading(true);
      setError("");
      const appointmentData = await AppointmentService.getById(id!);
      setAppointment(appointmentData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch appointment");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!appointment) return;

    try {
      setLoading(true);
      setError("");
      await AppointmentService.complete(id!);
      navigate("/dashboard/appointments");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to complete appointment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const getPatientName = () => {
    if (appointment && typeof appointment.patientId === "object") {
      return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }
    return "Unknown Patient";
  };

  const getDoctorName = () => {
    if (appointment && typeof appointment.doctorId === "object") {
      return appointment.doctorId.name;
    }
    return "Unknown Doctor";
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Appointment
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            Complete Appointment
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

  if (appointment.status !== "scheduled") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Appointment
          </h1>
          <button
            onClick={() => navigate(`/dashboard/appointments/${id}`)}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Details
          </button>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-600">
            This appointment cannot be completed because its status is:{" "}
            {appointment.status}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Appointment
        </h1>
        <button
          onClick={() => navigate(`/dashboard/appointments/${appointment._id}`)}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Back
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Mark as Completed
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to mark this appointment as completed?
                  This action will update the appointment status.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Appointment Details:
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Patient:</dt>
                <dd className="text-gray-900">{getPatientName()}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Doctor:</dt>
                <dd className="text-gray-900">{getDoctorName()}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Date:</dt>
                <dd className="text-gray-900">
                  {new Date(appointment.date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Time:</dt>
                <dd className="text-gray-900">{appointment.heure}</dd>
              </div>
            </dl>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() =>
                navigate(`/dashboard/appointments/${appointment._id}`)
              }
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Go Back
            </button>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Completing..." : "Mark as Completed"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
