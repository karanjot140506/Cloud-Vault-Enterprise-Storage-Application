import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleClickOutside = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, updatePosition]);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9999,
          }}
          className="w-56 bg-white dark:bg-[#12142B] backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-[0_16px_48px_rgba(31,32,65,0.22)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.6)] py-1.5 animate-fade-in-up"
        >
          <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
            <p className="text-sm font-semibold text-[#12142B] dark:text-[#E7E9F5] truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-[#8B90B5] truncate mt-0.5">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5C5F80] dark:text-[#A3A6C4] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
          >
            <User className="w-4 h-4 shrink-0" /> Profile
          </button>

          <div className="my-1 border-t border-black/5 dark:border-white/10" />

          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Logout
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] text-white flex items-center justify-center text-xs font-semibold shadow-sm shrink-0">
          {initials}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#9296B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {menu}
    </div>
  );
};

export default UserProfile;