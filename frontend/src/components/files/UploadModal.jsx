import { useState, useRef } from "react";
import { X, UploadCloud, FileUp } from "lucide-react";

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e, active) => {
    e.preventDefault();
    setDragActive(active);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await onUpload(selectedFile, setProgress);
      setSelectedFile(null);
      setProgress(0);
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_20px_60px_rgba(31,32,65,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9296B8] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#12142B] dark:hover:text-[#E7E9F5] transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-5">
          Upload File
        </h2>

        <div
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? "border-indigo-400 bg-indigo-50/70 dark:bg-indigo-500/10 scale-[1.01]"
              : "border-[#DEE1F0] dark:border-white/15 hover:border-indigo-300 dark:hover:border-indigo-500/40"
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            {selectedFile ? (
              <FileUp className="w-5.5 h-5.5 text-indigo-500" />
            ) : (
              <UploadCloud className="w-5.5 h-5.5 text-indigo-400" strokeWidth={1.75} />
            )}
          </div>
          <p className="text-sm font-medium text-[#12142B] dark:text-[#E7E9F5] truncate px-2">
            {selectedFile ? selectedFile.name : "Drag & drop a file here"}
          </p>
          {!selectedFile && (
            <p className="text-xs text-[#9296B8] mt-1">or click to browse</p>
          )}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="w-full h-2 bg-[#EEF0F8] dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full mt-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-200"
        >
          {uploading ? `Uploading... ${progress}%` : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadModal;
