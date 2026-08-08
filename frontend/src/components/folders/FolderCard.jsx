import { Folder, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

const FolderCard = ({ folder, onOpen, onDelete, onRename }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onDoubleClick={() => onOpen(folder)}
      className="relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
          <Folder size={20} className="text-amber-500" fill="currentColor" fillOpacity={0.15} />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
          className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition"
        >
          <MoreVertical size={16} className="text-gray-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-3 top-12 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); onRename(folder); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Edit2 size={14} /> Rename
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(folder); setMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <p
        onClick={() => onOpen(folder)}
        className="text-sm font-medium text-gray-800 truncate"
      >
        {folder.name}
      </p>
      <p className="text-xs text-gray-400 mt-1">{folder.itemCount ?? 0} items</p>
    </div>
  );
};

export default FolderCard;