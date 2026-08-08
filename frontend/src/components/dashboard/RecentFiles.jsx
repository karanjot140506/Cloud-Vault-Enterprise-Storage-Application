import {
  FileText,
  Image,
  FileArchive,
  MoreVertical,
  UploadCloud,
  LayoutGrid,
  List,
} from "lucide-react";
import { useState } from "react";

const iconMap = {
  pdf: FileText,
  image: Image,
  zip: FileArchive,
  default: FileText,
};

const iconStyles = {
  pdf: "text-rose-500 bg-rose-50 dark:bg-rose-500/10",
  image: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  zip: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  default: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
};

const RecentFiles = ({ files = [], onDropFile }) => {
  const [view, setView] = useState("list");
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e) => {
    if (!onDropFile) return;
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (onDropFile && e.dataTransfer.files?.[0]) {
      onDropFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-xl border rounded-[20px] overflow-hidden shadow-[0_8px_30px_rgba(31,32,65,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-colors duration-200 ${
        dragActive
          ? "border-indigo-400 ring-4 ring-indigo-500/10"
          : "border-black/5 dark:border-white/10"
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-black/5 dark:border-white/10">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold">
          Recent Files
        </h3>
        {files.length > 0 && (
          <div className="flex items-center gap-1 bg-[#F4F5FA] dark:bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                view === "grid"
                  ? "bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400"
                  : "text-[#9296B8]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${
                view === "list"
                  ? "bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400"
                  : "text-[#9296B8]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-indigo-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-[#5C5F80] dark:text-[#A3A6C4]">
            No recent files yet
          </p>
          <p className="text-xs text-[#9296B8] mt-1">
            {onDropFile ? "Drag and drop a file here to upload" : "Upload something to see it here"}
          </p>
        </div>
      ) : view === "list" ? (
        <ul>
          {files.map((file) => {
            const Icon = iconMap[file.type] || iconMap.default;
            const style = iconStyles[file.type] || iconStyles.default;
            return (
              <li
                key={file.id}
                className="flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] border-b border-black/5 dark:border-white/[0.06] last:border-0 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${style}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#12142B] dark:text-[#E7E9F5] truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-[#9296B8]">
                      {file.size} • {file.modifiedAt}
                    </p>
                  </div>
                </div>
                <button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#9296B8] transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5 sm:p-6">
          {files.map((file) => {
            const Icon = iconMap[file.type] || iconMap.default;
            const style = iconStyles[file.type] || iconStyles.default;
            return (
              <div
                key={file.id}
                className="group relative bg-[#F9FAFC] dark:bg-white/[0.03] border border-black/5 dark:border-white/[0.06] rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#9296B8] opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-[#12142B] dark:text-[#E7E9F5] truncate">
                  {file.name}
                </p>
                <p className="text-xs text-[#9296B8] mt-1">
                  {file.size} • {file.modifiedAt}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentFiles;
