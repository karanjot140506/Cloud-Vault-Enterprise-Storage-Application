import { useState, useEffect } from "react";
import SharedFileCard from "../components/sharing/SharedFileCard";
import { shareService } from "../api/shareService";
import { fileService } from "../api/fileService";

const SharedWithMe = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShared = async () => {
      try {
        const data = await shareService.getSharedWithMe();
        setFiles(data);
      } catch (err) {
        setError("Failed to load shared files");
      } finally {
        setLoading(false);
      }
    };
    loadShared();
  }, []);

  const handleDownload = (file) => fileService.downloadFile(file.id, file.name);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Shared with Me</h1>
      <p className="text-gray-500 text-sm mb-6">Files others have shared with you</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : files.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">
          No files have been shared with you yet
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <SharedFileCard key={file.id} file={file} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedWithMe;