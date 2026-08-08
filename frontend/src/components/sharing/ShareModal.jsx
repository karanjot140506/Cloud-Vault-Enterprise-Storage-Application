import { useState, useEffect } from "react";
import { X, Send, Trash2 } from "lucide-react";
import { shareService } from "../../api/shareService";

const ShareModal = ({ isOpen, onClose, file }) => {
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && file) {
      loadShares();
    }
  }, [isOpen, file]);

  const loadShares = async () => {
    setLoading(true);
    try {
      const data = await shareService.getFileShares(file.id);
      setShares(data);
    } catch (err) {
      console.error("Failed to load shares", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await shareService.shareFile(file.id, email.trim());
      setEmail("");
      await loadShares();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to share file");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (shareId) => {
    try {
      await shareService.revokeShare(file.id, shareId);
      setShares((prev) => prev.filter((s) => s.id !== shareId));
    } catch (err) {
      setError("Failed to revoke access");
    }
  };

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-1">Share "{file.name}"</h2>
        <p className="text-sm text-gray-500 mb-4">Invite people by email</p>

        <form onSubmit={handleShare} className="mb-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />

          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Send size={16} />
            {submitting ? "Sharing..." : "Share"}
          </button>
        </form>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">People with access</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : shares.length === 0 ? (
            <p className="text-sm text-gray-400">Not shared with anyone yet</p>
          ) : (
            <ul className="space-y-2">
              {shares.map((share) => (
                <li key={share.id} className="flex items-center justify-between py-1.5">
                  <p className="text-sm text-gray-800">{share.email}</p>
                  <button
                    onClick={() => handleRevoke(share.id)}
                    className="p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <Trash2 size={15} className="text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
