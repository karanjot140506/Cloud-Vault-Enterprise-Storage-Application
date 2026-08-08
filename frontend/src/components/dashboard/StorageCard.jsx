const GB = 1024 ** 3;
const MB = 1024 ** 2;

// Shows used storage in MB while it's small, switching to GB once it
// crosses 1 GB — so a handful of test uploads still register visibly
// instead of always rounding down to "0 GB".
const formatUsed = (bytes) => {
  if (bytes >= GB) {
    return { value: (bytes / GB).toFixed(2), unit: "GB" };
  }
  if (bytes >= MB) {
    return { value: (bytes / MB).toFixed(1), unit: "MB" };
  }
  return { value: (bytes / 1024).toFixed(1), unit: "KB" };
};

const StorageCard = ({ usedBytes = 0, totalGb = 15 }) => {
  const totalBytes = totalGb * GB;
  const percentage = totalBytes > 0 ? Math.min((usedBytes / totalBytes) * 100, 100) : 0;
  // Keep the ring/bar visibly non-zero for a nonzero-but-tiny usage,
  // otherwise the arc renders as an invisible sliver.
  const displayPercentage = usedBytes > 0 ? Math.max(percentage, 1.5) : 0;

  const { value, unit } = formatUsed(usedBytes);
  const freeGb = Math.max(totalGb - usedBytes / GB, 0);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayPercentage / 100) * circumference;

  return (
    <div className="bg-white/85 dark:bg-[#0B0F19]/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-[20px] shadow-[0_8px_30px_rgba(31,32,65,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-6 h-full">
      <h3 className="text-sm font-medium text-[#6B7094] dark:text-[#8B90B5] mb-5">
        Storage Used
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="9"
              className="text-[#EEF0F8] dark:text-white/[0.08]"
            />
            <defs>
              <linearGradient id="storageRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="url(#storageRingGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold">
              {percentage < 0.1 && percentage > 0 ? "<1" : Math.round(percentage)}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-end gap-1.5">
            <span className="font-[family-name:var(--font-display)] text-2xl font-semibold">
              {value}
            </span>
            <span className="text-sm text-[#9296B8] mb-1">
              {unit} of {totalGb} GB
            </span>
          </div>
          <div className="w-full h-2 bg-[#EEF0F8] dark:bg-white/[0.08] rounded-full overflow-hidden mt-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] transition-all duration-700 ease-out"
              style={{ width: `${displayPercentage}%` }}
            />
          </div>
          <p className="text-xs text-[#9296B8] mt-2">
            {freeGb.toFixed(1)} GB free
          </p>
        </div>
      </div>
    </div>
  );
};

export default StorageCard;