import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Navbar from "../components/dashboard/Navbar";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex h-screen bg-[#F7F8FC] dark:bg-[#05070F] text-[#12142B] dark:text-[#E7E9F5] overflow-hidden transition-colors duration-300">
      {/* ambient background accents */}
      <div className="pointer-events-none fixed top-[-8rem] right-[-6rem] w-96 h-96 bg-indigo-200/25 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-8rem] left-1/3 w-96 h-96 bg-violet-200/20 dark:bg-violet-500/10 rounded-full blur-3xl" />

      {/* mobile drawer overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
