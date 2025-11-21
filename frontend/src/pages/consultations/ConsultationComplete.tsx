import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Consultation } from "@/types/consultation";
import { ConsultationService } from "@/services/consultationService";

export default function ConsultationComplete() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConsultation = async () => {
    try {
      setFetchLoading(true);
      setError("");
      const consultationData = await ConsultationService.getById(id!);
      setConsultation(consultationData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch consultation");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!consultation) return;

    try {
      setLoading(true);
      setError("");
      await ConsultationService.complete(id!);
      navigate("/dashboard/consultations");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to complete consultation"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConsultation();
    }
  }, [id]);

  const getPatientName = () => {
    if (consultation && typeof consultation.patientId === "object") {
      return `${consultation.patientId.firstName} ${consultation.patientId.lastName}`;
    }
    return "Unknown Patient";
  };

  const getAppointmentDate = () => {
    if (
      consultation &&
      typeof consultation.appointmentId === "object" &&
      consultation.appointmentId !== null
    ) {
      return new Date(consultation.appointmentId.date).toLocaleDateString();
    }
    return "N/A";
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Consultation
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

  if (error || !consultation) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Consultation
          </h1>
          <button
            onClick={() => navigate("/dashboard/consultations")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Consultations
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {error || "Consultation not found"}
          </p>
        </div>
      </div>
    );
  }

  if (consultation.status === "completed") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete Consultation
          </h1>
          <button
            onClick={() => navigate("/dashboard/consultations")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Consultations
          </button>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            This consultation is already completed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Complete Consultation
        </h1>
        <button
          onClick={() => navigate("/dashboard/consultations")}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Back to Consultations
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Consultation Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium text-gray-900">
                {getPatientName()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Appointment Date:</span>
              <span className="font-medium text-gray-900">
                {getAppointmentDate()}
              </span>
            </div>
            {consultation.diagnosis && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Diagnosis:</span>
                <span className="font-medium text-gray-900 text-right max-w-md">
                  {consultation.diagnosis}
                </span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Current Status:</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                {consultation.status}
              </span>
            </div>
          </div>
        </div>{" "}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Confirm Completion
              </h3>
              <p className="mt-2 text-sm text-yellow-700">
                Are you sure you want to mark this consultation as completed?
                This action will update the consultation status to "completed".
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/dashboard/consultations")}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Completing..." : "Mark as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
}
