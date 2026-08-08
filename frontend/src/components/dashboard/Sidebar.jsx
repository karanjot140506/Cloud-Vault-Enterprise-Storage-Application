import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Folder,
  Share2,
  Trash2,
  Settings,
  Cloud,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/files", icon: Folder, label: "My Files" },
  { to: "/dashboard/shared", icon: Share2, label: "Shared with Me" },
  { to: "/dashboard/trash", icon: Trash2, label: "Trash" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white/85 dark:bg-[#0B0F19]/90 backdrop-blur-xl border-r border-black/5 dark:border-white/10 transition-all duration-300 ease-in-out
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo row */}
      <div className={`flex items-center h-16 border-b border-black/5 dark:border-white/10 ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center shadow-md shadow-indigo-500/30">
            <Cloud className="w-4.5 h-4.5 text-white" strokeWidth={2.25} />
          </div>
          {!collapsed && (
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight whitespace-nowrap">
              CloudVault
            </span>
          )}
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-[#9296B8] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            title={collapsed ? label : undefined}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-[#5C5F80] dark:text-[#9296B8] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#12142B] dark:hover:text-[#E7E9F5]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
                )}
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                {!collapsed && <span className="whitespace-nowrap">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:flex px-3 py-4 border-t border-black/5 dark:border-white/10">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#9296B8] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-[#12142B] dark:hover:text-[#E7E9F5] transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <ChevronsRight className="w-[18px] h-[18px]" />
          ) : (
            <>
              <ChevronsLeft className="w-[18px] h-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
