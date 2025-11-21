import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { MedicalRecord } from "@/types/medicalRecord";
import { MedicalRecordService } from "@/services/medicalRecordService";

export default function MedicalRecordDelete() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMedicalRecord = async () => {
    try {
      setFetchLoading(true);
      setError("");
      const recordData = await MedicalRecordService.getById(id!);
      setMedicalRecord(recordData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch medical record");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!medicalRecord) return;

    try {
      setLoading(true);
      setError("");
      await MedicalRecordService.delete(id!);
      navigate("/dashboard/records");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete medical record"
      );
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
      medicalRecord.patientId
    ) {
      return `${medicalRecord.patientId.firstName} ${medicalRecord.patientId.lastName}`;
    }
    return medicalRecord?.patientInfo?.name || "Unknown Patient";
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Delete Medical Record
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

  if (error || !medicalRecord) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Delete Medical Record
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
        <h1 className="text-3xl font-bold text-gray-900">
          Delete Medical Record
        </h1>
        <button
          onClick={() => navigate("/dashboard/records")}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Back to Medical Records
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
            Medical Record Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium text-gray-900">
                {getPatientName()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium text-gray-900">
                {medicalRecord.patientInfo.age} years
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium text-gray-900 capitalize">
                {medicalRecord.patientInfo.gender}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Contact:</span>
              <span className="font-medium text-gray-900">
                {medicalRecord.patientInfo.contact}
              </span>
            </div>
            {medicalRecord.allergies && medicalRecord.allergies.length > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Allergies:</span>
                <span className="font-medium text-gray-900 text-right max-w-md">
                  {medicalRecord.allergies.join(", ")}
                </span>
              </div>
            )}
            {medicalRecord.createdAt && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {new Date(medicalRecord.createdAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

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
                Are you sure you want to delete this medical record? This action
                cannot be undone and all patient medical data will be
                permanently removed from the system.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate("/dashboard/records")}
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
            {loading ? "Deleting..." : "Delete Medical Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
