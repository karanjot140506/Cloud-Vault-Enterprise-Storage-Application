import axiosInstance from "./axiosInstance";

// Backend sharing is a simple "grant this email access" model — there is
// no per-share permission level, so shares are just { id, email, sharedAt }.
const normalizeShare = (share) => ({
  id: share.id,
  email: share.email,
  sharedAt: share.sharedAt,
});

const normalizeSharedWithMeFile = (file) => ({
  id: file.fileId,
  name: file.originalFileName,
  contentType: file.contentType,
  size: file.size,
  sharedBy: file.sharedByEmail,
  sharedAt: file.sharedAt,
});

export const shareService = {
  shareFile: async (fileId, email) => {
    const res = await axiosInstance.post(`/files/${fileId}/share`, { email });
    return res.data;
  },

  getFileShares: async (fileId) => {
    const res = await axiosInstance.get(`/files/${fileId}/shares`);
    return res.data.data.map(normalizeShare);
  },

  revokeShare: async (fileId, shareId) => {
    const res = await axiosInstance.delete(`/files/${fileId}/shares/${shareId}`);
    return res.data;
  },

  getSharedWithMe: async () => {
    const res = await axiosInstance.get("/files/shared-with-me");
    return res.data.data.map(normalizeSharedWithMeFile);
  },
};
