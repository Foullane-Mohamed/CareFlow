import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Patient } from "@/types/patient";
import { PatientService } from "@/services/patientService";

export default function PatientDelete() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchPatient = async () => {
    try {
      setFetchLoading(true);
      setError("");
      const patientData = await PatientService.getById(id!);
      setPatient(patientData);
    } catch (err: any) {
      console.error("Failed to fetch patient:", err);
      setError(err.response?.data?.message || "Failed to fetch patient");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!patient) return;

    try {
      setLoading(true);
      setError("");
      await PatientService.delete(id!);
      navigate("/dashboard/patients");
    } catch (err: any) {
      console.error("Failed to delete patient:", err);
      setError(err.response?.data?.message || "Failed to delete patient");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Delete Patient</h1>
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

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Delete Patient</h1>
          <button
            onClick={() => navigate("/dashboard/patients")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Patients
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error || "Patient not found"}</p>
        </div>
      </div>
    );
  }

  return (    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Delete Patient</h1>{" "}
        <button
          onClick={() => navigate(`/dashboard/patients/${patient._id}`)}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Cancel
        </button>      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <p className="text-sm text-gray-700 mb-6">
            Are you sure you want to delete <strong>{patient.firstName} {patient.lastName}</strong>? 
            This action cannot be undone and will permanently remove all patient data.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Patient Details:
            </h4>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Name:</dt>
                <dd className="text-gray-900">
                  {patient.firstName} {patient.lastName}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Date of Birth:</dt>
                <dd className="text-gray-900">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Contact:</dt>
                <dd className="text-gray-900">{patient.contact}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Insurance:</dt>
                <dd className="text-gray-900">{patient.insurance}</dd>
              </div>
            </dl>          </div>

          <div className="flex justify-end space-x-4">
            {" "}
            <button
              type="button"
              onClick={() => navigate(`/dashboard/patients/${patient._id}`)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Deleting..." : "Delete Patient"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}