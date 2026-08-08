import { FileText, Image, FileArchive, Download, Trash2, Share2 } from "lucide-react";

const iconMap = { pdf: FileText, image: Image, zip: FileArchive, default: FileText };

const FileTable = ({ files, onDownload, onDelete, onShare }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Size</th>
            <th className="px-5 py-3 font-medium">Modified</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const Icon = iconMap[file.type] || iconMap.default;
            return (
              <tr key={file.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0">
                <td className="px-5 py-3 flex items-center gap-3">
                  <Icon size={18} className="text-blue-500" />
                  <span className="font-medium text-gray-800">{file.name}</span>
                </td>
                <td className="px-5 py-3 text-gray-500">{file.size}</td>
                <td className="px-5 py-3 text-gray-500">{file.modifiedAt}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onShare(file)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      <Share2 size={16} className="text-gray-500" />
                    </button>
                    <button onClick={() => onDownload(file)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      <Download size={16} className="text-gray-500" />
                    </button>
                    <button onClick={() => onDelete(file)} className="p-1.5 rounded-lg hover:bg-gray-100">
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
  );
};

export default FileTable;