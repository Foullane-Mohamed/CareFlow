import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/api/axiosConfig";
import type { User } from "@/types/user";

export default function Profile() {
  const { user: storeUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/api/auth/profile");
      setUser(response.data.user || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const displayUser = user || storeUser;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {displayUser?.name || "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                {displayUser?.email || "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    displayUser?.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : displayUser?.role === "doctor"
                        ? "bg-blue-100 text-blue-800"
                        : displayUser?.role === "infirmier"
                          ? "bg-green-100 text-green-800"
                          : displayUser?.role === "secretary"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {displayUser?.role?.toUpperCase() || "N/A"}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="p-3 bg-gray-50 rounded-md">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    displayUser?.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {displayUser?.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>

            {displayUser?._id && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID
                </label>
                <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                  {displayUser._id}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            To update your profile information, please contact your
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
