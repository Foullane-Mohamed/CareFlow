import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { MedicalRecordFormData, LabResult } from "@/types/medicalRecord";
import { MedicalRecordService } from "@/services/medicalRecordService";

export default function MedicalRecordEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  const [allergies, setAllergies] = useState<string[]>([""]);
  const [medicalHistory, setMedicalHistory] = useState<string[]>([""]);
  const [currentMedications, setCurrentMedications] = useState<string[]>([""]);
  const [labResults, setLabResults] = useState<LabResult[]>([
    { title: "", result: "", date: "" },
  ]);

  const [formData, setFormData] = useState<MedicalRecordFormData>({
    patientId: "",
    patientInfo: {
      name: "",
      age: 0,
      gender: "male",
      contact: "",
      insurance: "",
    },
    allergies: [],
    medicalHistory: [],
    currentMedications: [],
    labResults: [],
    notes: "",
    consent: false,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        setError("");

        const recordData = await MedicalRecordService.getById(id!);

        const patientId =
          typeof recordData.patientId === "object"
            ? recordData.patientId._id
            : recordData.patientId;

        setFormData({
          patientId,
          patientInfo: recordData.patientInfo,
          allergies: recordData.allergies || [],
          medicalHistory: recordData.medicalHistory || [],
          currentMedications: recordData.currentMedications || [],
          labResults: recordData.labResults || [],
          notes: recordData.notes || "",
          consent: recordData.consent,
        });

        setAllergies(
          recordData.allergies && recordData.allergies.length > 0
            ? recordData.allergies
            : [""]
        );
        setMedicalHistory(
          recordData.medicalHistory && recordData.medicalHistory.length > 0
            ? recordData.medicalHistory
            : [""]
        );
        setCurrentMedications(
          recordData.currentMedications &&
            recordData.currentMedications.length > 0
            ? recordData.currentMedications
            : [""]
        );
        setLabResults(
          recordData.labResults && recordData.labResults.length > 0
            ? recordData.labResults
            : [{ title: "", result: "", date: "" }]
        );
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

  const handlePatientInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      patientInfo: {
        ...prev.patientInfo,
        [name]: name === "age" ? Number(value) : value,
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleArrayChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  const addArrayItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, ""]);
  };

  const removeArrayItem = (
    index: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => {
      const newArray = prev.filter((_, i) => i !== index);
      return newArray.length ? newArray : [""];
    });
  };

  const handleLabResultChange = (
    index: number,
    field: keyof LabResult,
    value: string
  ) => {
    setLabResults((prev) => {
      const newResults = [...prev];
      newResults[index] = { ...newResults[index], [field]: value };
      return newResults;
    });
  };

  const addLabResult = () => {
    setLabResults((prev) => [...prev, { title: "", result: "", date: "" }]);
  };

  const removeLabResult = (index: number) => {
    setLabResults((prev) => {
      const newResults = prev.filter((_, i) => i !== index);
      return newResults.length
        ? newResults
        : [{ title: "", result: "", date: "" }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const recordData = {
        ...formData,
        allergies: allergies.filter((a) => a.trim() !== ""),
        medicalHistory: medicalHistory.filter((h) => h.trim() !== ""),
        currentMedications: currentMedications.filter((m) => m.trim() !== ""),
        labResults: labResults.filter(
          (lr) => lr.title.trim() !== "" && lr.result.trim() !== ""
        ),
      };

      await MedicalRecordService.update(id!, recordData);
      navigate(`/dashboard/records/${id}`);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update medical record"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Medical Record
        </h1>
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
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Medical Record
        </h1>
        <button
          onClick={() => navigate(`/dashboard/records/${id}`)}
          className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition"
        >
          Cancel
        </button>
      </div>
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}{" "}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection - Disabled for edit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient <span className="text-red-500">*</span>
            </label>
            <select
              name="patientId"
              value={formData.patientId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            >
              <option value={formData.patientId}>
                {formData.patientInfo.name}
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Patient cannot be changed when editing
            </p>
          </div>

          {/* Patient Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.patientInfo.name}
                  onChange={handlePatientInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.patientInfo.age}
                  onChange={handlePatientInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.patientInfo.gender}
                  onChange={handlePatientInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.patientInfo.contact}
                  onChange={handlePatientInfoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insurance
                </label>
                <input
                  type="text"
                  name="insurance"
                  value={formData.patientInfo.insurance}
                  onChange={handlePatientInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Allergies
              </label>
              <button
                type="button"
                onClick={() => addArrayItem(setAllergies)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add Allergy
              </button>
            </div>
            {allergies.map((allergy, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={allergy}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, setAllergies)
                  }
                  placeholder="Enter allergy"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {allergies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, setAllergies)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Medical History */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Medical History
              </label>
              <button
                type="button"
                onClick={() => addArrayItem(setMedicalHistory)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add History
              </button>
            </div>
            {medicalHistory.map((history, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={history}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, setMedicalHistory)
                  }
                  placeholder="Enter medical history"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {medicalHistory.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, setMedicalHistory)}
                    className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Current Medications */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Current Medications
              </label>
              <button
                type="button"
                onClick={() => addArrayItem(setCurrentMedications)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add Medication
              </button>
            </div>
            {currentMedications.map((medication, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={medication}
                  onChange={(e) =>
                    handleArrayChange(
                      index,
                      e.target.value,
                      setCurrentMedications
                    )
                  }
                  placeholder="Enter current medication"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {currentMedications.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeArrayItem(index, setCurrentMedications)
                    }
                    className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Lab Results */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Lab Results
              </label>
              <button
                type="button"
                onClick={addLabResult}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                + Add Lab Result
              </button>
            </div>
            {labResults.map((labResult, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Title
                    </label>
                    <input
                      type="text"
                      value={labResult.title}
                      onChange={(e) =>
                        handleLabResultChange(index, "title", e.target.value)
                      }
                      placeholder="e.g., Blood Test"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Result
                    </label>
                    <input
                      type="text"
                      value={labResult.result}
                      onChange={(e) =>
                        handleLabResultChange(index, "result", e.target.value)
                      }
                      placeholder="e.g., Normal"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={labResult.date}
                        onChange={(e) =>
                          handleLabResultChange(index, "date", e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {labResults.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLabResult(index)}
                          className="px-4 py-2 text-red-600 hover:text-red-700 border border-red-300 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Enter any additional notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Consent */}
          <div className="border-t pt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                required
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I confirm that the patient has given consent for this medical
                record <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/records/${id}`)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Medical Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
