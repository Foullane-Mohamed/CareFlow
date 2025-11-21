import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Consultation } from "@/types/consultation";
import { ConsultationService } from "@/services/consultationService";
import { useAuthStore } from "@/store/authStore";

export default function ConsultationsList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");

      if (user?.role === "patient" && user?._id) {
        const consultationsData = await ConsultationService.getByPatient(
          user._id
        );
        setConsultations(consultationsData);
      } else if (user?.role === "doctor" && user?._id) {
        const consultationsData = await ConsultationService.getByDoctor(
          user._id
        );
        setConsultations(consultationsData);
      } else {
        const consultationsData = await ConsultationService.getAll();
        setConsultations(consultationsData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);
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

  const getPatientName = (consultation: Consultation) => {
    if (
      typeof consultation.patientId === "object" &&
      consultation.patientId !== null
    ) {
      return `${consultation.patientId.firstName} ${consultation.patientId.lastName}`;
    }
    if (typeof consultation.patientId === "string") {
      return `Patient ID: ${consultation.patientId.slice(0, 8)}...`;
    }
    return "Unknown Patient";
  };

  const getAppointmentDate = (consultation: Consultation) => {
    if (
      typeof consultation.appointmentId === "object" &&
      consultation.appointmentId !== null
    ) {
      return new Date(consultation.appointmentId.date).toLocaleDateString();
    }
    return "N/A";
  };

  const canCreateConsultation = () => {
    return ["admin", "doctor"].includes(user?.role || "");
  };
  const canEdit = (consultation: Consultation) => {
    return (
      ["admin", "doctor"].includes(user?.role || "") &&
      consultation.status === "draft"
    );
  };

  const canDelete = (_consultation: Consultation) => {
    return ["admin"].includes(user?.role || "");
  };
  const canComplete = (consultation: Consultation) => {
    return (
      ["admin", "doctor"].includes(user?.role || "") &&
      consultation.status === "draft"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
        {canCreateConsultation() && (
          <button
            onClick={() => navigate("/dashboard/consultations/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            New Consultation
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow">
          <div className="animate-pulse p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : consultations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No consultations found</p>
          {canCreateConsultation() && (
            <button
              onClick={() => navigate("/dashboard/consultations/create")}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Create your first consultation
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation) => (
                  <tr key={consultation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getPatientName(consultation)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {getAppointmentDate(consultation)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {consultation.diagnosis || "No diagnosis yet"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                          consultation.status
                        )}`}
                      >
                        {consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/consultations/${consultation._id}`
                          )
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {canEdit(consultation) && (
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/consultations/${consultation._id}/edit`
                            )
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                      )}
                      {canComplete(consultation) && (
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/consultations/${consultation._id}/complete`
                            )
                          }
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Complete
                        </button>
                      )}
                      {canDelete(consultation) && (
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/consultations/${consultation._id}/delete`
                            )
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
