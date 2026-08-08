import { FileText, Image, FileArchive, Download } from "lucide-react";

const iconMap = { pdf: FileText, image: Image, zip: FileArchive, default: FileText };

const getFileType = (contentType = "") => {
  if (contentType.startsWith("image/")) return "image";
  if (contentType === "application/pdf") return "pdf";
  return "default";
};

const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
};

const SharedFileCard = ({ file, onDownload }) => {
  const Icon = iconMap[getFileType(file.contentType)] || iconMap.default;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={20} className="text-blue-600" />
        </div>
      </div>

      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
      <p className="text-xs text-gray-400 mt-1">{formatBytes(file.size)} • Shared by {file.sharedBy}</p>

      <button
        onClick={() => onDownload(file)}
        className="w-full flex items-center justify-center gap-2 mt-3 text-sm text-blue-600 border border-blue-200 rounded-lg py-1.5 hover:bg-blue-50 transition"
      >
        <Download size={14} /> Download
      </button>
    </div>
  );
};

export default SharedFileCard;
