import axiosInstance from "./axiosInstance";

// Requesting a large page size keeps the file manager's "load everything
// at once" UI working without needing full pagination controls yet.
const DEFAULT_PAGE_SIZE = 200;

const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
};

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const getFileType = (contentType = "", fileName = "") => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf" || ext === "pdf") return "pdf";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "zip";
  return "default";
};

// Maps the backend's FileResponse shape (id, originalFileName, contentType,
// size, uploadedAt) onto the fields the UI components expect (name, type,
// size as a readable string, modifiedAt as a readable date), while keeping
// the raw values around under a `raw` key in case a caller needs them.
const normalizeFile = (file) => ({
  id: file.id,
  name: file.originalFileName,
  type: getFileType(file.contentType, file.originalFileName),
  size: formatBytes(file.size),
  modifiedAt: formatDate(file.uploadedAt),
  raw: file,
});

export const fileService = {
  getFiles: async (folderId = null, search = null) => {
    const res = await axiosInstance.get("/files", {
      params: { folderId: folderId || undefined, search: search || undefined, page: 0, size: DEFAULT_PAGE_SIZE },
    });
    return res.data.data.content.map(normalizeFile);
  },

  getTrashedFiles: async () => {
    const res = await axiosInstance.get("/files/trash", {
      params: { page: 0, size: DEFAULT_PAGE_SIZE },
    });
    return res.data.data.content.map(normalizeFile);
  },

  uploadFile: async (file, folderId, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) {
      formData.append("folderId", folderId);
    }

    const res = await axiosInstance.post("/files/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress(percent);
        }
      },
    });
    return normalizeFile(res.data.data);
  },

  deleteFile: async (id) => {
    const res = await axiosInstance.delete(`/files/${id}`);
    return res.data;
  },

  restoreFile: async (id) => {
    const res = await axiosInstance.post(`/files/${id}/restore`);
    return res.data;
  },

  permanentlyDeleteFile: async (id) => {
    const res = await axiosInstance.delete(`/files/${id}/permanent`);
    return res.data;
  },

  downloadFile: async (id, filename) => {
    const res = await axiosInstance.get(`/files/${id}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
