import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Patient } from "@/types/patient";
import { PatientService } from "@/services/patientService";

export default function PatientDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError("");
      const patientData = await PatientService.getById(id!);
      setPatient(patientData);
    } catch (err: any) {
      console.error("Failed to fetch patient:", err);
      setError(err.response?.data?.message || "Failed to fetch patient");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
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

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
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
      
        <div className="flex space-x-3">
      
  
          <button
            onClick={() => navigate("/dashboard/patients")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
          >
            Back to Patients
          </button>
        </div>      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Patient Information
          </h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.firstName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Date of Birth
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date().getFullYear() -
                  new Date(patient.dateOfBirth).getFullYear()}{" "}
                years
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Contact Information
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{patient.contact}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Insurance</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {patient.insurance}
              </dd>
            </div>
          </dl>
        </div>      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
        <div className="flex space-x-4">
          {" "}
          <button
            onClick={() => navigate(`/dashboard/patients/${patient._id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit Patient
          </button>
          <button
            onClick={() =>
              navigate(`/dashboard/patients/${patient._id}/delete`)
            }
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Delete Patient
          </button>
        </div>
      </div>
    </div>
  );
}
