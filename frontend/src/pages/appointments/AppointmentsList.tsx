import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Appointment } from "@/types/appointment";
import { AppointmentService } from "@/services/appointmentService";
import { useAuthStore } from "@/store/authStore";

export default function AppointmentsList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      if (user?.role === "patient" && user?.id) {
        const appointmentsData = await AppointmentService.getByPatient(user.id);
        setAppointments(appointmentsData);
      } else {
        const appointmentsData = await AppointmentService.getAll();
        setAppointments(appointmentsData);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const getPatientName = (appointment: Appointment) => {
    if (
      typeof appointment.patientId === "object" &&
      appointment.patientId !== null
    ) {
      return `${appointment.patientId.firstName} ${appointment.patientId.lastName}`;
    }
    if (typeof appointment.patientId === "string") {
      return `Patient ID: ${appointment.patientId.slice(0, 8)}...`;
    }
    return "Unknown Patient";
  };

  const getDoctorName = (appointment: Appointment) => {
    if (
      typeof appointment.doctorId === "object" &&
      appointment.doctorId !== null
    ) {
      return appointment.doctorId.name;
    }
    if (typeof appointment.doctorId === "string") {
      return `Doctor ID: ${appointment.doctorId.slice(0, 8)}...`;
    }
    return "Unknown Doctor";
  };

  const canCreateAppointment = () => {
    return ["admin", "doctor", "infirmier", "secretary", "patient"].includes(
      user?.role || ""
    );
  };

  const canEdit = (_appointment: Appointment) => {
    return ["admin", "doctor", "infirmier", "secretary"].includes(
      user?.role || ""
    );
  };

  const canDelete = (_appointment: Appointment) => {
    return ["admin", "secretary"].includes(user?.role || "");
  };

  const canComplete = (appointment: Appointment) => {
    return (
      ["admin", "doctor"].includes(user?.role || "") &&
      appointment.status === "scheduled"
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        {canCreateAppointment() && (
          <button
            onClick={() => navigate("/dashboard/appointments/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Schedule Appointment
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getPatientName(appointment)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getDoctorName(appointment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.heure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/appointments/${appointment._id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded transition"
                        >
                          View
                        </button>
                        {canEdit(appointment) &&
                          appointment.status === "scheduled" && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/dashboard/appointments/${appointment._id}/edit`
                                )
                              }
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded transition"
                            >
                              Edit
                            </button>
                          )}
                        {canComplete(appointment) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/appointments/${appointment._id}/complete`
                              )
                            }
                            className="text-purple-600 hover:text-purple-900 px-2 py-1 rounded transition"
                          >
                            Complete
                          </button>
                        )}
                        {appointment.status === "scheduled" && (
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/appointments/${appointment._id}/cancel`
                              )
                            }
                            className="text-orange-600 hover:text-orange-900 px-2 py-1 rounded transition"
                          >
                            Cancel
                          </button>
                        )}
                        {canDelete(appointment) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/dashboard/appointments/${appointment._id}/delete`
                              )
                            }
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
