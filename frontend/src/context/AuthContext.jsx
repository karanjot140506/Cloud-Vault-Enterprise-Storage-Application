import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

// Backend returns fields flattened (id, fullName, email, role, token,
// refreshToken) rather than a nested user object, so normalize it into
// the shape the rest of the app expects.
const normalizeUser = (authData) => ({
  id: authData.id,
  name: authData.fullName,
  email: authData.email,
  role: authData.role,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("cloudvault_token");
    const storedUser = localStorage.getItem("cloudvault_user");
    if (token && storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("cloudvault_token");
        localStorage.removeItem("cloudvault_refresh_token");
        localStorage.removeItem("cloudvault_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const authData = res.data.data;
      const userData = normalizeUser(authData);

      localStorage.setItem("cloudvault_token", authData.token);
      localStorage.setItem("cloudvault_refresh_token", authData.refreshToken);
      localStorage.setItem("cloudvault_user", JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      await axiosInstance.post("/auth/register", { fullName: name, email, password });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (e) {
      // Ignore — we clear local session regardless of whether the
      // server-side logout call succeeds.
    }
    localStorage.removeItem("cloudvault_token");
    localStorage.removeItem("cloudvault_refresh_token");
    localStorage.removeItem("cloudvault_user");
    setUser(null);
  };

  const updateUser = (partialUser) => {
    setUser((prev) => {
      const next = { ...prev, ...partialUser };
      localStorage.setItem("cloudvault_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};