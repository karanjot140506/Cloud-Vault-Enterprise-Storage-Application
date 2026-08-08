import { useState, useEffect } from "react";
import { FileText, Image, FileArchive, RotateCcw, Trash2 } from "lucide-react";
import { fileService } from "../api/fileService";
import { useToast } from "../context/ToastContext";

const iconMap = { pdf: FileText, image: Image, zip: FileArchive, default: FileText };

const Trash = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const loadTrash = async () => {
    setLoading(true);
    try {
      const data = await fileService.getTrashedFiles();
      setFiles(data);
      setError("");
    } catch (err) {
      setError("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (file) => {
    try {
      await fileService.restoreFile(file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      showToast("File restored");
    } catch (err) {
      showToast("Failed to restore file", "error");
    }
  };

  const handlePermanentDelete = async (file) => {
    if (!window.confirm(`Permanently delete "${file.name}"? This cannot be undone.`)) return;
    try {
      await fileService.permanentlyDeleteFile(file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      showToast("File permanently deleted");
    } catch (err) {
      showToast("Failed to delete file", "error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Trash</h1>
      <p className="text-gray-500 text-sm mb-6">Deleted files. Restore them or remove them for good.</p>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : files.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">
          Trash is empty
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Size</th>
                <th className="px-5 py-3 font-medium">Deleted</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => {
                const Icon = iconMap[file.type] || iconMap.default;
                return (
                  <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <Icon size={18} className="text-gray-400" />
                      <span className="font-medium text-gray-800">{file.name}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{file.size}</td>
                    <td className="px-5 py-3 text-gray-500">{file.modifiedAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleRestore(file)}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          title="Restore"
                        >
                          <RotateCcw size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(file)}
                          className="p-1.5 rounded-lg hover:bg-gray-100"
                          title="Delete permanently"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trash;
