import axiosInstance from "./axiosInstance";

export const userService = {
  getProfile: async () => {
    const res = await axiosInstance.get("/users/me");
    return res.data.data;
  },

  updateProfile: async (fullName) => {
    const res = await axiosInstance.put("/users/me", { fullName });
    return res.data.data;
  },

  getStorageUsage: async () => {
    const res = await axiosInstance.get("/users/me/storage");
    return res.data.data;
  },
};
