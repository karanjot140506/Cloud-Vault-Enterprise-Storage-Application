import { useState } from "react";
import { X, FolderPlus } from "lucide-react";

const NewFolderModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Folder name is required");
      return;
    }
    setSubmitting(true);
    try {
      await onCreate(name.trim());
      setName("");
      setError("");
      onClose();
    } catch (err) {
      setError("Failed to create folder");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_20px_60px_rgba(31,32,65,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9296B8] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#12142B] dark:hover:text-[#E7E9F5] transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
          <FolderPlus className="w-5 h-5 text-indigo-500" strokeWidth={1.75} />
        </div>

        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-4">
          New Folder
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            className="w-full px-4 py-2.5 rounded-xl bg-[#F4F5FA] dark:bg-white/5 border border-transparent text-sm placeholder:text-[#A2A5C4] dark:placeholder:text-[#6C709A] outline-none focus:bg-white dark:focus:bg-white/[0.07] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
          />
          {error && <p className="text-red-500 dark:text-red-400 text-xs mt-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-5 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-200"
          >
            {submitting ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewFolderModal;
