import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive(path)
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col h-screen sticky top-0">
    
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-blue-400">CareFlow</h2>
      </div>


      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link to="/dashboard" className={linkClass("/dashboard")}>
          <span className="flex items-center gap-3">
            <span>Dashboard</span>
          </span>
        </Link>

    
        {user?.role === "admin" && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              Administration
            </div>
            <Link to="/dashboard/users" className={linkClass("/dashboard/users")}>
              <span className="flex items-center gap-3">
                
                <span>Users</span>
              </span>
            </Link>
            <Link to="/dashboard/patients" className={linkClass("/dashboard/patients")}>
              <span className="flex items-center gap-3">
                <span>Patients</span>
              </span>
            </Link>
            <Link to="/dashboard/appointments" className={linkClass("/dashboard/appointments")}>
              <span className="flex items-center gap-3">
                <span>Appointments</span>
              </span>
            </Link>
            <Link to="/dashboard/records" className={linkClass("/dashboard/records")}>
              <span className="flex items-center gap-3">
                <span>Medical Records</span>
              </span>
            </Link>
          </>
        )}

    
        {user?.role === "doctor" && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              Clinical
            </div>
            <Link to="/dashboard/patients" className={linkClass("/dashboard/patients")}>
              <span className="flex items-center gap-3">
                <span>Patients</span>
              </span>
            </Link>
            <Link to="/dashboard/appointments" className={linkClass("/dashboard/appointments")}>
              <span className="flex items-center gap-3">
                <span>Appointments</span>
              </span>
            </Link>
            <Link to="/dashboard/consultations" className={linkClass("/dashboard/consultations")}>
              <span className="flex items-center gap-3">
                <span>Consultations</span>
              </span>
            </Link>
            <Link to="/dashboard/records" className={linkClass("/dashboard/records")}>
              <span className="flex items-center gap-3">
                <span>Medical Records</span>
              </span>
            </Link>
          </>
        )}

        {user?.role === "infirmier" && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              Nursing
            </div>
            <Link to="/dashboard/patients" className={linkClass("/dashboard/patients")}>
              <span className="flex items-center gap-3">
                <span>Patients</span>
              </span>
            </Link>
            <Link to="/dashboard/appointments" className={linkClass("/dashboard/appointments")}>
              <span className="flex items-center gap-3">
                <span>Appointments</span>
              </span>
            </Link>
            <Link to="/dashboard/consultations" className={linkClass("/dashboard/consultations")}>
              <span className="flex items-center gap-3">
                <span>View Consultations</span>
              </span>
            </Link>
          </>
        )}

      
        {user?.role === "secretary" && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              Administration
            </div>
            <Link to="/dashboard/patients" className={linkClass("/dashboard/patients")}>
              <span className="flex items-center gap-3">
                <span>Patients</span>
              </span>
            </Link>
            <Link to="/dashboard/appointments" className={linkClass("/dashboard/appointments")}>
              <span className="flex items-center gap-3">

                <span>Appointments</span>
              </span>
            </Link>
          </>
        )}

  
        {user?.role === "patient" && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              My Health
            </div>
            <Link to="/dashboard/my-appointments" className={linkClass("/dashboard/my-appointments")}>
              <span className="flex items-center gap-3">
            
                <span> Appointments</span>
              </span>
            </Link>
            <Link to="/dashboard/my-records" className={linkClass("/dashboard/my-records")}>
              <span className="flex items-center gap-3">
          
                <span>Medical Records</span>
              </span>
            </Link>
            <Link to="/dashboard/my-consultations" className={linkClass("/dashboard/my-consultations")}>
              <span className="flex items-center gap-3">
              
                <span>Consultations</span>
              </span>
            </Link>
          </>
        )}
      </nav>

  

    </aside>
  );
}
