import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../api/userService";
import { useToast } from "../context/ToastContext";

const Settings = () => {
  const { updateUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await userService.getProfile();
        setFullName(profile.fullName);
        setEmail(profile.email);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const updated = await userService.updateProfile(fullName.trim());
      updateUser({ name: updated.fullName });
      showToast("Profile updated");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      setError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Settings</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your account details</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-lg">
        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg outline-none mb-1 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mb-4">Email cannot be changed</p>

            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
