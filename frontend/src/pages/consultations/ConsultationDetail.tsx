import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Consultation } from "@/types/consultation";
import { ConsultationService } from "@/services/consultationService";
import { useAuthStore } from "@/store/authStore";

export default function ConsultationDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      setError("");
      const consultationData = await ConsultationService.getById(id!);
      setConsultation(consultationData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch consultation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConsultation();
    }
  }, [id]);
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

  const getPatientName = () => {
    if (
      consultation &&
      typeof consultation.patientId === "object" &&
      consultation.patientId !== null
    ) {
      return `${consultation.patientId.firstName} ${consultation.patientId.lastName}`;
    }
    if (consultation && typeof consultation.patientId === "string") {
      return `Patient ID: ${consultation.patientId.slice(0, 8)}...`;
    }
    return "Unknown Patient";
  };

  const getPatientContact = () => {
    if (
      consultation &&
      typeof consultation.patientId === "object" &&
      consultation.patientId !== null
    ) {
      return consultation.patientId.contact;
    }
    return "N/A";
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

  const getAppointmentTime = () => {
    if (
      consultation &&
      typeof consultation.appointmentId === "object" &&
      consultation.appointmentId !== null
    ) {
      return consultation.appointmentId.heure;
    }
    return "N/A";
  };
  const canEdit = () => {
    return (
      ["admin", "doctor"].includes(user?.role || "") &&
      consultation?.status === "draft"
    );
  };

  const canDelete = () => {
    return ["admin"].includes(user?.role || "");
  };
  const canComplete = () => {
    return (
      ["admin", "doctor"].includes(user?.role || "") &&
      consultation?.status === "draft"
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Consultation Details
          </h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            Consultation Details
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
          Consultation Details
        </h1>
        <div className="flex gap-3">
          {canEdit() && (
            <button
              onClick={() => navigate(`/dashboard/consultations/${id}/edit`)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Edit
            </button>
          )}
          {canComplete() && (
            <button
              onClick={() =>
                navigate(`/dashboard/consultations/${id}/complete`)
              }
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
            >
              Complete
            </button>
          )}
          {canDelete() && (
            <button
              onClick={() => navigate(`/dashboard/consultations/${id}/delete`)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard/consultations")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getPatientName()}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Contact: {getPatientContact()}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                consultation.status
              )}`}
            >
              {consultation.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Appointment Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Appointment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-base text-gray-900">
                  {getAppointmentDate()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-base text-gray-900">
                  {getAppointmentTime()}
                </p>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          {consultation.vitalSigns &&
            Object.keys(consultation.vitalSigns).length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Vital Signs
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {consultation.vitalSigns.bloodPressure && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Blood Pressure</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.bloodPressure}
                      </p>
                    </div>
                  )}
                  {consultation.vitalSigns.heartRate && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.heartRate} bpm
                      </p>
                    </div>
                  )}
                  {consultation.vitalSigns.temperature && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.temperature}°C
                      </p>
                    </div>
                  )}
                  {consultation.vitalSigns.weight && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.weight} kg
                      </p>
                    </div>
                  )}
                  {consultation.vitalSigns.height && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Height</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.height} cm
                      </p>
                    </div>
                  )}
                  {consultation.vitalSigns.respiratoryRate && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Respiratory Rate</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.respiratoryRate} bpm
                      </p>
                    </div>
                  )}
                  {consultation.vitalSigns.oxygenSaturation && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Oxygen Saturation</p>
                      <p className="text-base font-medium text-gray-900">
                        {consultation.vitalSigns.oxygenSaturation}%
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Diagnosis */}
          {consultation.diagnosis && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Diagnosis
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {consultation.diagnosis}
              </p>
            </div>
          )}

          {/* Procedures */}
          {consultation.procedures && consultation.procedures.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Procedures
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {consultation.procedures.map((procedure, index) => (
                  <li key={index} className="text-gray-700">
                    {procedure}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Notes */}
          {consultation.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {consultation.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">
                  {consultation.createdAt
                    ? new Date(consultation.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-900">
                  {consultation.updatedAt
                    ? new Date(consultation.updatedAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
