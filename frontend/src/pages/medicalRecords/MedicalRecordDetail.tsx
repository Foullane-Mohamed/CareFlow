import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { MedicalRecord } from "@/types/medicalRecord";
import { MedicalRecordService } from "@/services/medicalRecordService";
import { useAuthStore } from "@/store/authStore";

export default function MedicalRecordDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMedicalRecord = async () => {
    try {
      setLoading(true);
      setError("");
      const recordData = await MedicalRecordService.getById(id!);
      setMedicalRecord(recordData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch medical record");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMedicalRecord();
    }
  }, [id]);

  const getPatientName = () => {
    if (
      medicalRecord &&
      typeof medicalRecord.patientId === "object" &&
      medicalRecord.patientId !== null
    ) {
      return `${medicalRecord.patientId.firstName} ${medicalRecord.patientId.lastName}`;
    }
    return medicalRecord?.patientInfo?.name || "Unknown Patient";
  };

  const canEdit = () => {
    return ["admin", "doctor"].includes(user?.role || "");
  };

  const canDelete = () => {
    return ["admin"].includes(user?.role || "");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Medical Record Details
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

  if (error || !medicalRecord) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Medical Record Details
          </h1>
          <button
            onClick={() => navigate("/dashboard/records")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Medical Records
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">
            {error || "Medical record not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Medical Record</h1>
        <div className="flex gap-3">
          {canEdit() && (
            <button
              onClick={() => navigate(`/dashboard/records/${id}/edit`)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              Edit
            </button>
          )}
          {canDelete() && (
            <button
              onClick={() => navigate(`/dashboard/records/${id}/delete`)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Delete
            </button>
          )}
          <button
            onClick={() => navigate("/dashboard/records")}
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
                {medicalRecord.patientInfo.age} years old •{" "}
                <span className="capitalize">
                  {medicalRecord.patientInfo.gender}
                </span>
              </p>
            </div>
            {medicalRecord.consent && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                Consent Obtained
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="text-base text-gray-900">
                  {medicalRecord.patientInfo.contact}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Insurance</p>
                <p className="text-base text-gray-900">
                  {medicalRecord.patientInfo.insurance || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          {medicalRecord.allergies && medicalRecord.allergies.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Allergies
              </h3>
              <div className="flex flex-wrap gap-2">
                {medicalRecord.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Medical History */}
          {medicalRecord.medicalHistory &&
            medicalRecord.medicalHistory.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Medical History
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {medicalRecord.medicalHistory.map((history, index) => (
                    <li key={index} className="text-gray-700">
                      {history}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Current Medications */}
          {medicalRecord.currentMedications &&
            medicalRecord.currentMedications.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Current Medications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {medicalRecord.currentMedications.map((medication, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {medication}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Lab Results */}
          {medicalRecord.labResults && medicalRecord.labResults.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Lab Results
              </h3>
              <div className="space-y-3">
                {medicalRecord.labResults.map((labResult, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {labResult.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Result: {labResult.result}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(labResult.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {medicalRecord.notes && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {medicalRecord.notes}
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
                  {medicalRecord.createdAt
                    ? new Date(medicalRecord.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="text-gray-900">
                  {medicalRecord.updatedAt
                    ? new Date(medicalRecord.updatedAt).toLocaleString()
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
