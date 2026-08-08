import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cloudvault_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const clearSession = () => {
  localStorage.removeItem("cloudvault_token");
  localStorage.removeItem("cloudvault_refresh_token");
  localStorage.removeItem("cloudvault_user");
};

let refreshPromise = null;

// Uses a bare axios call (not axiosInstance) so it doesn't recurse through
// these same interceptors.
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("cloudvault_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  const { token, refreshToken: newRefreshToken } = res.data.data;
  localStorage.setItem("cloudvault_token", token);
  if (newRefreshToken) {
    localStorage.setItem("cloudvault_refresh_token", newRefreshToken);
  }
  return token;
};

// Handle expired access tokens by transparently refreshing once, then
// give up (and send the user to /login) if that also fails.
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
