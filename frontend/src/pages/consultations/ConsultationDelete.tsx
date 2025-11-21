import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Consultation } from "@/types/consultation";
import { ConsultationService } from "@/services/consultationService";

export default function ConsultationDelete() {
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

  const handleDelete = async () => {
    if (!consultation) return;

    try {
      setLoading(true);
      setError("");
      await ConsultationService.delete(id!);
      navigate("/dashboard/consultations");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete consultation");
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
    if (
      consultation &&
      typeof consultation.patientId === "object" &&
      consultation.patientId
    ) {
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
  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Delete Consultation
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
            Delete Consultation
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Delete Consultation
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
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
                  consultation.status
                )}`}
              >
                {consultation.status}
              </span>
            </div>
            {consultation.createdAt && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(consultation.createdAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>{" "}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Warning: Permanent Deletion
              </h3>
              <p className="mt-2 text-sm text-red-700">
                Are you sure you want to delete this consultation? This action
                cannot be undone and all consultation data will be permanently
                removed from the system.
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
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Delete Consultation"}
          </button>
        </div>
      </div>
    </div>
  );
}
