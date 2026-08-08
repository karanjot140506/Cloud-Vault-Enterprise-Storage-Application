import FileCard from "./FileCard";
import FileTable from "./FileTable";

const FileExplorer = ({ files, view, onDownload, onDelete, onShare }) => {
  if (files.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-400 text-sm">
        No files yet. Upload your first file to get started.
      </div>
    );
  }

  if (view === "table") {
    return <FileTable files={files} onDownload={onDownload} onDelete={onDelete} onShare={onShare} />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} onDownload={onDownload} onDelete={onDelete} onShare={onShare} />
      ))}
    </div>
  );
};

export default FileExplorer;