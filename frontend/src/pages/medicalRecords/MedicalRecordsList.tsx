import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MedicalRecord } from "@/types/medicalRecord";
import { MedicalRecordService } from "@/services/medicalRecordService";
import { useAuthStore } from "@/store/authStore";

export default function MedicalRecordsList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMedicalRecords = async () => {
    try {
      setLoading(true);
      setError("");

      if (user?.role === "patient" && user?.id) {
        const recordsData = await MedicalRecordService.getByPatient(user.id);
        setMedicalRecords(recordsData);
      } else {
        const recordsData = await MedicalRecordService.getAll();
        setMedicalRecords(recordsData);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch medical records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const getPatientName = (record: MedicalRecord) => {
    if (typeof record.patientId === "object" && record.patientId !== null) {
      return `${record.patientId.firstName} ${record.patientId.lastName}`;
    }
    if (typeof record.patientId === "string") {
      return `Patient ID: ${record.patientId.slice(0, 8)}...`;
    }
    return record.patientInfo?.name || "Unknown Patient";
  };

  const canCreateRecord = () => {
    return ["admin", "doctor"].includes(user?.role || "");
  };

  const canEdit = (_record: MedicalRecord) => {
    return ["admin", "doctor"].includes(user?.role || "");
  };

  const canDelete = (_record: MedicalRecord) => {
    return ["admin"].includes(user?.role || "");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Medical Records</h1>
        {canCreateRecord() && (
          <button
            onClick={() => navigate("/dashboard/records/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            New Medical Record
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
      ) : medicalRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No medical records found</p>
          {canCreateRecord() && (
            <button
              onClick={() => navigate("/dashboard/records/create")}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Create your first medical record
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
                    Age / Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allergies
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medical History
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicalRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getPatientName(record)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.patientInfo?.contact || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.patientInfo?.age || "N/A"} years
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {record.patientInfo?.gender || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {record.allergies && record.allergies.length > 0
                          ? record.allergies.join(", ")
                          : "None"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {record.medicalHistory &&
                        record.medicalHistory.length > 0
                          ? record.medicalHistory.join(", ")
                          : "None"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {record.updatedAt
                          ? new Date(record.updatedAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/records/${record._id}`)
                        }
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {canEdit(record) && (
                        <button
                          onClick={() =>
                            navigate(`/dashboard/records/${record._id}/edit`)
                          }
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete(record) && (
                        <button
                          onClick={() =>
                            navigate(`/dashboard/records/${record._id}/delete`)
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
