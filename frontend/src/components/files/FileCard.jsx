import { FileText, Image, FileArchive, Download, Trash2, Share2, MoreVertical } from "lucide-react";
import { useState } from "react";

const iconMap = { pdf: FileText, image: Image, zip: FileArchive, default: FileText };

const FileCard = ({ file, onDownload, onDelete, onShare }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = iconMap[file.type] || iconMap.default;

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition group">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={20} className="text-blue-600" />
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-3 top-12 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={() => { onShare(file); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={() => { onDownload(file); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={() => { onDelete(file); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
      <p className="text-xs text-gray-400 mt-1">{file.size} • {file.modifiedAt}</p>
    </div>
  );
};

export default FileCard;