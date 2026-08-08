import { useState, useEffect } from "react";
import { Plus, FolderPlus } from "lucide-react";
import FileExplorer from "../components/files/FileExplorer";
import UploadModal from "../components/files/UploadModal";
import ViewToggle from "../components/files/ViewToggle";
import FolderCard from "../components/folders/FolderCard";
import Breadcrumbs from "../components/folders/Breadcrumbs";
import NewFolderModal from "../components/folders/NewFolderModal";
import ShareModal from "../components/sharing/ShareModal";
import { fileService } from "../api/fileService";
import { folderService } from "../api/folderService";
import { useFolderNavigation } from "../hooks/useFolderNavigation";
import { useToast } from "../context/ToastContext";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [error, setError] = useState("");

  const { currentFolderId, path, navigateToFolder, navigateToBreadcrumb } = useFolderNavigation();
  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [filesData, foldersData] = await Promise.all([
        fileService.getFiles(currentFolderId),
        folderService.getFolders(currentFolderId),
      ]);
      setFiles(filesData);
      setFolders(foldersData);
      setError("");
    } catch (err) {
      setError("Failed to load files and folders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolderId]);

  const handleUpload = async (file, onProgress) => {
    try {
      await fileService.uploadFile(file, currentFolderId, onProgress);
      await loadData();
      showToast("File uploaded");
    } catch (err) {
      showToast("Upload failed", "error");
      throw err;
    }
  };

  const handleCreateFolder = async (name) => {
    try {
      await folderService.createFolder(name, currentFolderId);
      await loadData();
      showToast("Folder created");
    } catch (err) {
      showToast("Failed to create folder", "error");
      throw err;
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!window.confirm(`Delete folder "${folder.name}" and all its contents?`)) return;
    try {
      await folderService.deleteFolder(folder.id);
      setFolders((prev) => prev.filter((f) => f.id !== folder.id));
      showToast("Folder deleted");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete folder";
      setError(message);
      showToast(message, "error");
    }
  };

  const handleRenameFolder = async (folder) => {
    const newName = window.prompt("Rename folder:", folder.name);
    if (!newName || newName === folder.name) return;
    try {
      await folderService.renameFolder(folder.id, newName);
      await loadData();
      showToast("Folder renamed");
    } catch (err) {
      setError("Failed to rename folder");
      showToast("Failed to rename folder", "error");
    }
  };

  const handleDownload = (file) => {
    fileService.downloadFile(file.id, file.name);
  };

  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    try {
      await fileService.deleteFile(file.id);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      showToast("File moved to trash");
    } catch (err) {
      setError("Failed to delete file");
      showToast("Failed to delete file", "error");
    }
  };

  const handleShare = (file) => {
    setFileToShare(file);
    setShareModalOpen(true);
  };

  return (
    <div>
      <Breadcrumbs path={path} onNavigate={navigateToBreadcrumb} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {path[path.length - 1].name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {folders.length} folders • {files.length} files
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} setView={setView} />
          <button
            onClick={() => setFolderModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            <FolderPlus size={16} /> New Folder
          </button>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus size={16} /> Upload
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : (
        <>
          {folders.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={navigateToFolder}
                  onDelete={handleDeleteFolder}
                  onRename={handleRenameFolder}
                />
              ))}
            </div>
          )}

          <FileExplorer
            files={files}
            view={view}
            onDownload={handleDownload}
            onDelete={handleDeleteFile}
            onShare={handleShare}
          />
        </>
      )}

      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUpload} />
      <NewFolderModal isOpen={folderModalOpen} onClose={() => setFolderModalOpen(false)} onCreate={handleCreateFolder} />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} file={fileToShare} />
    </div>
  );
};

export default FileManager;
