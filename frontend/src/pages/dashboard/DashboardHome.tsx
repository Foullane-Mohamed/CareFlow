import { useAuthStore } from "@/store/authStore";

export default function DashboardHome() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Your Role</h3>
            <p className="text-2xl font-bold text-blue-900 capitalize mt-2">
              {user?.role}
            </p>
          </div>
          
      
          
    
        </div>
      </div>

    
    </div>
  );
}

