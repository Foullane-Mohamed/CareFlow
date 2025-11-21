import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ConsultationFormData } from "@/types/consultation";
import type { Patient } from "@/types/patient";
import type { Appointment } from "@/types/appointment";
import type { MedicalRecord } from "@/types/medicalRecord";
import { ConsultationService } from "@/services/consultationService";
import { PatientService } from "@/services/patientService";
import { AppointmentService } from "@/services/appointmentService";
import { MedicalRecordService } from "@/services/medicalRecordService";

export default function ConsultationEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [procedures, setProcedures] = useState<string[]>([""]);

  const [formData, setFormData] = useState<ConsultationFormData>({
    appointmentId: "",
    patientId: "",
    medicalRecordId: "",
    vitalSigns: {
      bloodPressure: "",
      heartRate: undefined,
      temperature: undefined,
      weight: undefined,
      height: undefined,
      respiratoryRate: undefined,
      oxygenSaturation: undefined,
    },
    diagnosis: "",
    procedures: [],
    notes: "",
    status: "draft",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setError("");
        const [
          consultationData,
          patientsData,
          appointmentsData,
          medicalRecordsData,
        ] = await Promise.all([
          ConsultationService.getById(id!),
          PatientService.getAll(),
          AppointmentService.getAll(),
          MedicalRecordService.getAll(),
        ]);

        const appointmentId =
          typeof consultationData.appointmentId === "object"
            ? consultationData.appointmentId._id
            : consultationData.appointmentId;

        const patientId =
          typeof consultationData.patientId === "object"
            ? consultationData.patientId._id
            : consultationData.patientId;

        const medicalRecordId =
          typeof consultationData.medicalRecordId === "object" &&
          consultationData.medicalRecordId !== null
            ? consultationData.medicalRecordId._id
            : consultationData.medicalRecordId || "";

        setFormData({
          appointmentId,
          patientId,
          medicalRecordId,
          vitalSigns: consultationData.vitalSigns || {},
          diagnosis: consultationData.diagnosis || "",
          procedures: consultationData.procedures || [],
          notes: consultationData.notes || "",
          status: consultationData.status,
        });

        setProcedures(
          consultationData.procedures && consultationData.procedures.length > 0
            ? consultationData.procedures
            : [""]
        );
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setMedicalRecords(medicalRecordsData);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVitalSignsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [name]: value
          ? name === "bloodPressure"
            ? value
            : Number(value)
          : undefined,
      },
    }));
  };

  const handleProcedureChange = (index: number, value: string) => {
    const newProcedures = [...procedures];
    newProcedures[index] = value;
    setProcedures(newProcedures);
  };

  const addProcedure = () => {
    setProcedures([...procedures, ""]);
  };

  const removeProcedure = (index: number) => {
    const newProcedures = procedures.filter((_, i) => i !== index);
    setProcedures(newProcedures.length ? newProcedures : [""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const filteredProcedures = procedures.filter((p) => p.trim() !== "");

      const consultationData = {
        ...formData,
        procedures: filteredProcedures,
      };

      await ConsultationService.update(id!, consultationData);
      navigate(`/dashboard/consultations/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update consultation");
    } finally {
      setLoading(false);
    }
  };

  const getPatientName = (appointment: Appointment) => {
    if (
      typeof appointment.patientId === "object" &&
      appointment.patientId !== null
    ) {
      return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }
    return "Unknown Patient";
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Consultation</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Consultation</h1>
        <button
          onClick={() => navigate(`/dashboard/consultations/${id}`)}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Cancel
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
            {/* Appointment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment <span className="text-red-500">*</span>
              </label>
              <select
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an appointment</option>
                {appointments.map((appointment) => (
                  <option key={appointment._id} value={appointment._id}>
                    {getPatientName(appointment)} -{" "}
                    {new Date(appointment.date).toLocaleDateString()} at{" "}
                    {appointment.heure}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient <span className="text-red-500">*</span>
              </label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>{" "}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical Record (Optional)
              </label>
              <select
                name="medicalRecordId"
                value={formData.medicalRecordId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">
                  {medicalRecords.length === 0
                    ? "No medical records available"
                    : "Select a medical record (optional)"}
                </option>
                {medicalRecords.map((record) => {
                  const patientName =
                    typeof record.patientId === "object"
                      ? `${record.patientId.firstName} ${record.patientId.lastName}`
                      : record.patientInfo.name;
                  const recordDate = new Date(
                    record.createdAt || ""
                  ).toLocaleDateString();
                  return (
                    <option key={record._id} value={record._id}>
                      {patientName} - {recordDate} - ID: {record._id.slice(-6)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/* Vital Signs */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vital Signs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.vitalSigns?.bloodPressure || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="120/80"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.vitalSigns?.heartRate || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="72"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.vitalSigns?.temperature || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="36.8"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.vitalSigns?.weight || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="70"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.vitalSigns?.height || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="175"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respiratory Rate (bpm)
                </label>
                <input
                  type="number"
                  name="respiratoryRate"
                  value={formData.vitalSigns?.respiratoryRate || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="16"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="number"
                  name="oxygenSaturation"
                  value={formData.vitalSigns?.oxygenSaturation || ""}
                  onChange={handleVitalSignsChange}
                  placeholder="98"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={4}
              placeholder="Enter diagnosis details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Procedures */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Procedures
              </label>
              <button
                type="button"
                onClick={addProcedure}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add Procedure
              </button>
            </div>
            {procedures.map((procedure, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={procedure}
                  onChange={(e) => handleProcedureChange(index, e.target.value)}
                  placeholder="Enter procedure"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {procedures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProcedure(index)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>{" "}
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Enter consultation notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Set to "Draft" to save for later, or "Completed" to finalize the
              consultation
            </p>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/consultations/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Consultation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
