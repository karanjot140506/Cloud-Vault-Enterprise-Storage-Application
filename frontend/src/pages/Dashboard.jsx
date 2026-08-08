import { useState, useEffect, useMemo } from "react";
import {
  UploadCloud,
  FolderPlus,
  Share2,
  Trash2,
  Cloud,
  Zap,
  PieChart,
  Clock,
  FolderOpen,
  ArrowRight,
  Files,
  HardDrive,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadModal from "../components/files/UploadModal";
import NewFolderModal from "../components/folders/NewFolderModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { fileService } from "../api/fileService";
import { folderService } from "../api/folderService";
import { userService } from "../api/userService";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Still up, night owl";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good evening";
};

const fileTypeStyles = {
  pdf: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-500" },
  image: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-500" },
  zip: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-500" },
  default: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-500" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [ringProgress, setRingProgress] = useState(0);

  const loadDashboard = async () => {
    try {
      const [filesData, storageData] = await Promise.all([
        fileService.getFiles(),
        userService.getStorageUsage(),
      ]);
      setFiles(filesData.slice(0, 5));
      setStorage(storageData);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const usedBytes = storage?.totalSizeBytes || 0;
  const totalBytes = 15 * 1024 ** 3;
  const usedGb = usedBytes / 1024 ** 3;
  const usedPercent = totalBytes > 0 ? Math.min(100, Math.round((usedBytes / totalBytes) * 100)) : 0;
  const freeGb = Math.max(0, 15 - usedGb);
  const totalFiles = storage?.totalFiles ?? files.length;

  useEffect(() => {
    if (loading) return;
    const raf = requestAnimationFrame(() => setRingProgress(usedPercent));
    return () => cancelAnimationFrame(raf);
  }, [loading, usedPercent]);

  const greeting = useMemo(() => getGreeting(), []);
  const firstName = user?.name?.split(" ")[0] || "there";

  const handleUpload = async (file, onProgress) => {
    try {
      await fileService.uploadFile(file, null, onProgress);
      await loadDashboard();
      showToast("File uploaded");
    } catch (err) {
      showToast("Upload failed", "error");
      throw err;
    }
  };

  const handleQuickDrop = async (file) => {
    try {
      await fileService.uploadFile(file, null);
      await loadDashboard();
      showToast("File uploaded");
    } catch (err) {
      showToast("Upload failed", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleQuickDrop(file);
  };

  const handleCreateFolder = async (name) => {
    try {
      await folderService.createFolder(name, null);
      showToast("Folder created");
    } catch (err) {
      showToast("Failed to create folder", "error");
      throw err;
    }
  };

  const quickActions = [
    {
      label: "Upload File",
      description: "Upload from device",
      icon: UploadCloud,
      iconBg: "from-[#4F46E5] to-[#6366F1]",
      onClick: () => setUploadModalOpen(true),
    },
    {
      label: "New Folder",
      description: "Create a new folder",
      icon: FolderPlus,
      iconBg: "from-[#2563EB] to-[#3B82F6]",
      onClick: () => setFolderModalOpen(true),
    },
    {
      label: "Share File",
      description: "Share with others",
      icon: Share2,
      iconBg: "from-[#059669] to-[#10B981]",
      onClick: () => navigate("/dashboard/files"),
    },
    {
      label: "View Trash",
      description: "Deleted items",
      icon: Trash2,
      iconBg: "from-[#DC2626] to-[#EF4444]",
      onClick: () => navigate("/dashboard/trash"),
    },
  ];

  const statChips = [
    { label: "Total files", value: totalFiles, icon: Files },
    { label: "Storage used", value: `${usedGb.toFixed(usedGb < 10 ? 1 : 0)} GB`, icon: HardDrive },
    { label: "Free space", value: `${freeGb.toFixed(1)} GB`, icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#4338CA] via-[#5B4FE0] to-[#8B5CF6] px-6 sm:px-8 py-8 sm:py-10 shadow-[0_16px_40px_rgba(79,70,229,0.28)] animate-fade-in-up">
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-drift-slow" />
        <div className="absolute -bottom-20 left-10 w-56 h-56 rounded-full bg-[#38BDF8]/15 blur-3xl animate-drift-slower" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex items-center justify-between gap-6">
          <div>
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-2">
              {greeting}
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Welcome back, {firstName} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
            </h1>
            <p className="text-white/75 mt-1.5 text-sm sm:text-base">
              Here's what's happening with your files.
            </p>
          </div>
          <div className="hidden sm:flex w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm items-center justify-center flex-shrink-0 animate-float-gentle">
            <Cloud className="w-10 h-10 text-white" strokeWidth={1.5} fill="rgba(255,255,255,0.2)" />
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 mt-7">
          {statChips.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5"
            >
              <Icon className="w-3.5 h-3.5 text-white/70" strokeWidth={2} />
              <span className="text-sm font-semibold text-white">{value}</span>
              <span className="text-xs text-white/60">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Overview + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2fr] gap-6">
        <div
          className="bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] p-6 shadow-[0_8px_30px_rgba(31,32,65,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-fade-in-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <PieChart className="w-4 h-4 text-[#6366F1]" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-[#12142B] dark:text-[#E7E9F5]">Storage Overview</h2>
          </div>

          <div className="flex flex-col items-center">
            <div
              className="relative w-28 h-28 rounded-full flex items-center justify-center transition-[background] duration-700 ease-out"
              style={{ background: `conic-gradient(#6366F1 ${ringProgress * 3.6}deg, #E7E8F5 0deg)` }}
            >
              <div className="absolute inset-2 rounded-full bg-white dark:bg-[#0B0F19] flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-[#12142B] dark:text-[#E7E9F5] tabular-nums">
                  {usedPercent}%
                </span>
                <span className="text-[10px] text-[#9296B8]">Used</span>
              </div>
            </div>

            <p className="mt-5 text-sm font-semibold text-[#12142B] dark:text-[#E7E9F5] tabular-nums">
              {usedGb.toFixed(usedGb < 10 ? 1 : 0)} GB / 15 GB
            </p>

            <div className="w-full h-1.5 rounded-full bg-[#E7E8F5] dark:bg-white/10 mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] transition-all duration-700 ease-out"
                style={{ width: `${ringProgress}%` }}
              />
            </div>

            <p className="text-xs text-[#9296B8] mt-2">{freeGb.toFixed(1)} GB free</p>
          </div>
        </div>

        <div
          className="bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] p-6 shadow-[0_8px_30px_rgba(31,32,65,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] animate-fade-in-up"
          style={{ animationDelay: "140ms" }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-4 h-4 text-[#6366F1]" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-[#12142B] dark:text-[#E7E9F5]">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map(({ label, description, icon: Icon, iconBg, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="group relative text-left rounded-2xl p-3 hover:bg-[#F5F5FC] dark:hover:bg-white/5 transition-all duration-200"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 group-hover:scale-105 transition-all duration-200`}
                >
                  <Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.75} />
                </div>
                <p className="text-xs font-semibold text-[#12142B] dark:text-[#E7E9F5] mt-2.5">{label}</p>
                <p className="text-[11px] text-[#9296B8] mt-0.5 leading-tight">{description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Files */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-xl border rounded-[20px] p-6 shadow-[0_8px_30px_rgba(31,32,65,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-colors duration-200 animate-fade-in-up ${
          isDragging
            ? "border-indigo-400 dark:border-indigo-500/50 bg-indigo-50/60 dark:bg-indigo-500/5"
            : "border-black/5 dark:border-white/10"
        }`}
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#6366F1]" strokeWidth={2} />
            <h2 className="text-sm font-semibold text-[#12142B] dark:text-[#E7E9F5]">Recent Files</h2>
          </div>
          <button
            onClick={() => navigate("/dashboard/files")}
            className="group flex items-center gap-1 text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            View all
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </button>
        </div>

        {loading ? (
          <div className="min-h-[220px] flex flex-col items-center justify-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full h-12 rounded-xl bg-[#F0F1FA] dark:bg-white/5 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="min-h-[220px] flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/10 dark:to-purple-500/10 flex items-center justify-center mb-4 animate-float-gentle">
              <FolderOpen className="w-7 h-7 text-[#8B7CFF]" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-semibold text-[#12142B] dark:text-[#E7E9F5]">No recent files yet</p>
            <p className="text-xs text-[#9296B8] mt-1">Upload files and they'll appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {files.map((file, i) => {
              const style = fileTypeStyles[file.type] || fileTypeStyles.default;
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0 -mx-2 px-2 rounded-xl hover:bg-[#F5F5FC] dark:hover:bg-white/5 transition-colors duration-150 animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                      <FolderOpen className={`w-4 h-4 ${style.text}`} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#12142B] dark:text-[#E7E9F5] truncate">{file.name}</p>
                      <p className="text-xs text-[#9296B8]">
                        {file.size} • {file.modifiedAt}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleUpload} />
      <NewFolderModal isOpen={folderModalOpen} onClose={() => setFolderModalOpen(false)} onCreate={handleCreateFolder} />
    </div>
  );
};

export default Dashboard;