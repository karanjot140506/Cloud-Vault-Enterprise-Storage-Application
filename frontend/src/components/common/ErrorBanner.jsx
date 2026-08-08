import { AlertCircle, X } from "lucide-react";

const ErrorBanner = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="flex items-start justify-between gap-3 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg mb-4">
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;