import axiosInstance from "./axiosInstance";

export const folderService = {
  getFolders: async (parentFolderId = null) => {
    const res = await axiosInstance.get("/folders", {
      params: { parentFolderId: parentFolderId || undefined },
    });
    return res.data.data;
  },

  createFolder: async (name, parentFolderId = null) => {
    const res = await axiosInstance.post("/folders", { name, parentFolderId });
    return res.data.data;
  },

  renameFolder: async (id, name) => {
    const res = await axiosInstance.put(`/folders/${id}`, { name });
    return res.data.data;
  },

  deleteFolder: async (id) => {
    const res = await axiosInstance.delete(`/folders/${id}`);
    return res.data;
  },
};
