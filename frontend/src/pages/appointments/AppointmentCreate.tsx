import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { AppointmentFormData } from "@/types/appointment";
import type { Patient } from "@/types/patient";
import { AppointmentService } from "@/services/appointmentService";
import { PatientService } from "@/services/patientService";
import { UserService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

interface DoctorOption {
  _id: string;
  name: string;
  email: string;
}

export default function AppointmentCreate() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);

  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: "",
    doctorId: "",
    date: "",
    heure: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const doctorsData = await UserService.getAllDoctors();

        const formattedDoctors: DoctorOption[] = doctorsData
          .map((d) => ({
            _id: d._id || d.id || "",
            name: d.name,
            email: d.email,
          }))
          .filter((d) => d._id);
        setDoctors(formattedDoctors);

        if (user?.role === "patient" && user?.id) {
          setFormData((prev) => ({
            ...prev,
            patientId: user.id,
          }));
        } else {
          const patientsData = await PatientService.getAll();
          setPatients(patientsData);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await AppointmentService.create(formData);
      navigate("/dashboard/appointments");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Schedule Appointment
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Schedule New Appointment
        </h1>
        <button
          onClick={() => navigate("/dashboard/appointments")}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Back to Appointments
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.role === "patient" ? (
              <input
                type="hidden"
                name="patientId"
                value={formData.patientId}
              />
            ) : (
              <div>
                <label
                  htmlFor="patientId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label
                htmlFor="doctorId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Doctor <span className="text-red-500">*</span>
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} {doctor.email ? `- ${doctor.email}` : ""}
                  </option>
                ))}
              </select>
              {doctors.length === 0 && (
                <p className="mt-1 text-xs text-red-500">
                  No doctors available. Please contact your administrator.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>{" "}
            <div>
              <label
                htmlFor="heure"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Time <span className="text-red-500">*</span>
              </label>
              <select
                id="heure"
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a time</option>
                <option value="08:00">08:00</option>
                <option value="08:30">08:30</option>
                <option value="09:00">09:00</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
                <option value="10:30">10:30</option>
                <option value="11:00">11:00</option>
                <option value="11:30">11:30</option>
                <option value="12:00">12:00</option>
                <option value="12:30">12:30</option>
                <option value="13:00">13:00</option>
                <option value="13:30">13:30</option>
                <option value="14:00">14:00</option>
                <option value="14:30">14:30</option>
                <option value="15:00">15:00</option>
                <option value="15:30">15:30</option>
                <option value="16:00">16:00</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Appointments available from 08:00 to 16:00
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/appointments")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {loading ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
